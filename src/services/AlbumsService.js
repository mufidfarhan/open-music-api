/* eslint camelcase: "off" */

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { simpleSongModel } = require('../../utils');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    // cek apakah id sudah bertambah
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text:
        `SELECT 
          albums.id AS album_id, 
          albums.name, 
          albums.year, 
          songs.id, 
          songs.title, 
          songs.performer 
        FROM 
          albums 
        LEFT JOIN 
          songs ON songs.album_id = albums.id
        WHERE 
          albums.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songs = result.rows.length >= 1 && result.rows[0].id != null ? result.rows.map(simpleSongModel) : [];

    const album = {
      id: result.rows[0].album_id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      songs: songs,
    };

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    // cek apakah rows terdapat data
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus, Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;