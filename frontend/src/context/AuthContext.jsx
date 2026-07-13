import { createContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi } from "../services/authService";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Khôi phục thông tin user từ localStorage khi load lại trang
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    saveAuthData(data);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await registerApi(username, email, password);
    saveAuthData(data);
    return data;
  };

  const saveAuthData = (data) => {
    const userData = { id: data.userId, username: data.username, email: data.email };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;