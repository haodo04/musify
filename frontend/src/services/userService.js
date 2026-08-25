import api from "./api";

export const updateProfile = async (username, avatarFile) => {
  const formData = new FormData();
  if (username) formData.append("username", username);
  if (avatarFile) formData.append("avatarFile", avatarFile);

  const res = await api.put("/users/me", formData);
  return res.data;
};