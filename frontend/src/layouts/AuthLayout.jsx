import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const AuthLayout = () => {
  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default AuthLayout;