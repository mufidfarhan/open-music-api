const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { songsModel } = require('../../utils');

class PlaylistSongsService {
  constructor(songsService) {
    this._pool = new Pool();
    this._songsService = songsService;
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const { title } = await this._songsService.getSongById(songId);

    await this.verifySongInPlaylist(playlistId, songId, title);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4) RETURNING playlist_id',
      values: [playlistId, songId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    return title;
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text:`
        SELECT
          playlists.id AS playlist_id,
          playlists.name,
          users.username,
          songs.id, 
          songs.title, 
          songs.performer 
        FROM
          playlist_songs
        RIGHT JOIN 
          playlists ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN 
          users ON playlists.owner = users.id
        LEFT JOIN 
          songs ON playlist_songs.song_id = songs.id
        WHERE 
          playlists.id = $1
        `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songs = result.rows.length >= 1 && result.rows[0].id ? result.rows.map(songsModel) : [];

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: songs,
    };

    return playlist;
  }

  async deleteSongInPlaylist({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING playlist_id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongInPlaylist(playlistId, songId, title) {
    const query = {
      text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(`Gagal menambahkan lagu. "${title}" sudah terdaftar di dalam playlist`);
    }
  }
}

module.exports = PlaylistSongsService;
