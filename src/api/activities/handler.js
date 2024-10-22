const autoBind = require('auto-bind');

class ActivitiesHandler {
  constructor(activitiesService, playlistsService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const data = await this._activitiesService.getActivityById(playlistId);

    return {
      status: 'success',
      data,
    };
  }
}

module.exports = ActivitiesHandler;
