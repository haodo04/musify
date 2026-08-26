import api from "./api";

export const followArtist = async (artistId) => {
  await api.post(`/follows/${artistId}`);
};

export const unfollowArtist = async (artistId) => {
  await api.delete(`/follows/${artistId}`);
};

export const getMyFollowedArtists = async () => {
  const res = await api.get("/follows");
  return res.data;
};

export const getFollowerCount = async (artistId) => {
  const res = await api.get(`/follows/${artistId}/count`);
  return res.data.count;
};