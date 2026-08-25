import api from "./api";

export const getAllUsersAdmin = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/users/${userId}/role`, null, { params: { role } });
  return res.data;
};