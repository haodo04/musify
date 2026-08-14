import api from "./api";

export const getAllAlbums = async () => {
  const res = await api.get("/albums");
  return res.data;
};

export const getAlbumById = async (id) => {
  const res = await api.get(`/albums/${id}`);
  return res.data;
};

export const getFeaturedCharts = async () => {
  const res = await api.get("/albums/charts");
  return res.data;
};

export const createAlbum = async (title, releaseDate, artistId, coverFile) => {
  const formData = new FormData();
  formData.append("title", title);
  if (releaseDate) formData.append("releaseDate", releaseDate);
  formData.append("artistId", artistId);
  if (coverFile) formData.append("coverFile", coverFile);

  const res = await api.post("/albums", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};