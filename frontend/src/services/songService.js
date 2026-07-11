import api from "./api";

export const getAllSongs = async () => {
  const res = await api.get("/songs");
  return res.data;
};

export const getSongById = async (id) => {
  const res = await api.get(`/songs/${id}`);
  return res.data;
};

export const getSongsByAlbum = async (albumId) => {
  const res = await api.get(`/songs/album/${albumId}`);
  return res.data;
};

export const searchSongs = async (keyword) => {
  const res = await api.get(`/songs/search`, { params: { keyword } });
  return res.data;
};