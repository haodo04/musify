import api from "./api";

export const getMyPlaylists = async () => {
  const res = await api.get("/playlists/me");
  return res.data;
};

export const createPlaylist = async (name, description, isPublic) => {
  const res = await api.post("/playlists", { name, description, isPublic });
  return res.data;
};

export const getPlaylistById = async (id) => {
  const res = await api.get(`/playlists/${id}`);
  return res.data;
};

export const addSongToPlaylist = async (playlistId, songId) => {
  const res = await api.post(`/playlists/${playlistId}/songs/${songId}`);
  return res.data;
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  await api.delete(`/playlists/${playlistId}/songs/${songId}`);
};