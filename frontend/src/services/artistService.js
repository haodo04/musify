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

export const getArtistById = async (id) => {
  try {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chi tiết nghệ sĩ:", error);
    throw error;
  }
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