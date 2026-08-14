import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import Album from "../pages/Album/Album"
import Library from "../pages/Library/Library"
import Playlist from "../pages/Playlist/Playlist"
import ProtectedRoute from "../routes/ProtectedRoute"
import Admin from "../pages/Admin/Admin"
import { useEffect, useRef } from "react"

const MainLayout = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = "#121212";
    }
  });

  return (
    <div
      ref={displayRef}
      className={`m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto
        ${isAdminPage ? "w-[calc(100%-1rem)]" : "w-[100%] lg:w-[75%] lg:ml-0"}`}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/library" element={
          <ProtectedRoute><Library /></ProtectedRoute>
        } />
        <Route path="/playlist/:id" element={
          <ProtectedRoute><Playlist /></ProtectedRoute>
        } />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default MainLayout