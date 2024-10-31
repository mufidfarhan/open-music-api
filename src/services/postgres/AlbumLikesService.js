const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool;
    this._cacheService = cacheService;
  }

  async addLikeToAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, userId, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`albums:${albumId}`);
    return result.rows[0].id;
  }

  async deleteLikeInAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING album_id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    await this._cacheService.delete(`albums:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    await this._cacheService.set(`albums:${albumId}`, result.rows[0].count);

    return result.rows[0].count;
  }

  async verifyAlbumLike(userId, albumId, albumName) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(`Gagal menyukai album. Album ${albumName} sudah Anda sukai`);
    }
  }
}

module.exports = AlbumLikesService;