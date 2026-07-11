import api from "./api";

export const getAllAlbums = async () => {
  const res = await api.get("/albums");
  return res.data;
};

export const getAlbumById = async (id) => {
  const res = await api.get(`/albums/${id}`);
  return res.data;
};