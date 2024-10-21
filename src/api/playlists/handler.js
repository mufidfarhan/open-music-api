const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    autoBind(this);
  };

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: userId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: userId });

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
    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
    await this._playlistsService.deletePlaylistById({ playlistId });

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };

  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const title = await this._playlistSongsService.addSongToPlaylist({ playlistId, songId, userId });

    const response = h.response({
      status: 'success',
      message: `${title} berhasil ditambahkan`,
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

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

    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    await this._playlistSongsService.deleteSongInPlaylist({ playlistId, songId });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    };
  }
}

module.exports = PlaylistsHandler;