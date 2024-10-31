const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const { name } = await this._albumsService.getAlbumById(albumId);

    await this._albumLikesService.verifyAlbumLike(credentialId, albumId, name);
    await this._albumLikesService.addLikeToAlbum(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: `Menyukai album ${name}`,
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumLikesService.deleteLikeInAlbum(credentialId, albumId);

    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
  }

  async getAlbumLikesHandler(request) {
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    const likes = await this._albumLikesService.getAlbumLikes(albumId);

    return {
      status: 'success',
      data: {
        likes: likes,
      },
    };
  }
}

module.exports = AlbumLikesHandler;
