import api from "./api";

export const createArtist = async ({ name, bio, avatarFile }) => {
  const form = new FormData();
  form.append("name", name);
  if (bio) form.append("bio", bio);
  if (avatarFile) form.append("avatarFile", avatarFile);
  const res = await api.post("/artists", form);
  return res.data;
};

export const getAllArtists = async () => {
  const res = await api.get("/artists");
  return res.data;
};

export const createAlbum = async ({ title, releaseDate, artistId, coverFile }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("artistId", artistId);
  if (releaseDate) form.append("releaseDate", releaseDate);
  if (coverFile) form.append("coverFile", coverFile);
  const res = await api.post("/albums", form);
  return res.data;
};

export const getAllAlbums = async () => {
  const res = await api.get("/albums");
  return res.data;
};

export const createSong = async ({ title, genre, duration, artistId, albumId, audioFile, imageFile }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("genre", genre);
  form.append("duration", duration);
  form.append("artistId", artistId);
  if (albumId) form.append("albumId", albumId);
  form.append("audioFile", audioFile);
  if (imageFile) form.append("imageFile", imageFile);
  const res = await api.post("/songs/upload", form);
  return res.data;
};

export const getAllSongs = async () => {
  const res = await api.get("/songs");
  return res.data;
};