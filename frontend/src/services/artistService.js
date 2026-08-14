import api from "./api";

export const getAllArtists = async () => {
  const res = await api.get("/artists");
  return res.data;
};

export const createArtist = async (name, bio, avatarFile) => {
  const formData = new FormData();
  formData.append("name", name);
  if (bio) formData.append("bio", bio);
  if (avatarFile) formData.append("avatarFile", avatarFile);

  const res = await api.post("/artists", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};