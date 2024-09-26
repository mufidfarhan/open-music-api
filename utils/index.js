/* eslint camelcase: "off" */

const albumModel = ({
  album_id,
  name,
  year,
  songs,
}) => ({
  id: album_id,
  name,
  year,
  songs,
});

const songsModel = ({
  song_id,
  title,
  performer,
}) => ({
  id: song_id,
  title,
  performer,
});

const songModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { albumModel, songsModel, songModel };