const AlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { albumLikesService, albumsService, cacheService }) => {
    const albumLikesHandler = new AlbumLikesHandler(albumLikesService, albumsService, cacheService);

    server.route(routes(albumLikesHandler));
  },
};