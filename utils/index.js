const albumsModel = ({ 
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

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
})

module.exports = { albumsModel, songsModel, songModel };