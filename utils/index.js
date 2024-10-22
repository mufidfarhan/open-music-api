/* eslint camelcase: "off" */

// songs
const simpleSongModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const detailedSongModel = ({
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
const playlistModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const activityModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  simpleSongModel,
  detailedSongModel,
  playlistModel,
  activityModel,
};