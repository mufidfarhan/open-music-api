const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { activityModel } = require('../../utils');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool;
  }

  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getActivityById(playlistId) {
    const query = {
      text:
        `SELECT 
          psa.id,
          psa.playlist_id,
          psa.action,
          psa.time,
          u.username,
          s.title
        FROM 
          playlist_song_activities psa
        LEFT JOIN
          users u ON u.id = psa.user_id
        LEFT JOIN
          songs s ON s.id = psa.song_id
        WHERE
          psa.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activitas tidak ditemukan');
    }

    const activity = result.rows.length >= 1 && result.rows[0].id != null ? result.rows.map(activityModel) : [];

    const data = {
      playlistId: result.rows[0].playlist_id,
      activities: activity,
    };

    return data;
  }
}

module.exports = ActivitiesService;