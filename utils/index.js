/* eslint camelcase: "off" */

// songs
const songsModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const songModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

// playlist
const playlistsModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = {
  songsModel,
  songModel,
  playlistsModel,
};