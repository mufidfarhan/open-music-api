const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    autoBind(this);
  };

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById({ playlistId });

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const title = await this._playlistSongsService.addSongToPlaylist({ playlistId, songId });

    this._activitiesService.addActivity({ playlistId, songId, userId: credentialId, action: 'add' });

    const response = h.response({
      status: 'success',
      message: `lagu "${title}" berhasil ditambahkan ke dalam playlists`,
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistSongsService.getSongsInPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistSongsService.deleteSongInPlaylist({ playlistId, songId });

    this._activitiesService.addActivity({ playlistId, songId, userId: credentialId, action: 'delete' });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }
}

module.exports = PlaylistsHandler;