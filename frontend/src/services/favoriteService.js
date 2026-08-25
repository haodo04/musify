import api from "./api";

export const getMyFavorites = async () => {
  const res = await api.get("/favorites");
  return res.data;
};

export const addFavorite = async (songId) => {
  await api.post(`/favorites/${songId}`);
};

export const removeFavorite = async (songId) => {
  await api.delete(`/favorites/${songId}`);
};