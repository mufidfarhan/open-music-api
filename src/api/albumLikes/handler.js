/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(albumLikesService, albumsService, cacheService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;
    this._cacheService = cacheService;

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

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);

    try {
      const likes = await this._cacheService.get(`albums:${albumId}`);

      const response = h.response({
        status: 'success',
        data: {
          likes: parseInt(likes),
        },
      });

      response.header('X-Data-Source', 'cache');
      return response;

    } catch (error) {
      const likes = await this._albumLikesService.getAlbumLikes(albumId);

      return {
        status: 'success',
        data: {
          likes: parseInt(likes),
        },
      };
    }
  }
}

module.exports = AlbumLikesHandler;
