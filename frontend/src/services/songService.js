import axios from "axios";
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

export const searchSemantic = async (query, topK = 8) => {
  const res = await api.get(`/songs/search/semantic`, { params: { q: query, topK } });
  return res.data;
};

export const getTrendingSongs = async () => {
  const res = await api.get("/songs/trending");
  return res.data;
};

export const recordPlay = async (id) => {
  await api.post(`/songs/${id}/play`);
};

export const uploadSong = async (title, genre, duration, artistId, albumId, audioFile, imageFile) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("genre", genre);
  formData.append("duration", duration);
  formData.append("artistId", artistId);
  if (albumId) formData.append("albumId", albumId);
  formData.append("audioFile", audioFile);
  if (imageFile) formData.append("imageFile", imageFile);

  const res = await api.post("/songs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getSongsByArtist = async (artistId) => {
  try {
    const res = await api.get(`/songs/artist/${artistId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy bài hát của nghệ sĩ:", error);
    return []; 
  }
};