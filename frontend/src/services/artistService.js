import api from "./api";

export const getAllArtists = async () => {
  const res = await api.get("/artists");
  return res.data;
};