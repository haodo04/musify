import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import Album from "../pages/Album/Album"
import Library from "../pages/Library/Library"
import Playlist from "../pages/Playlist/Playlist"
import ProtectedRoute from "../routes/ProtectedRoute"
import Admin from "../pages/Admin/Admin"
import { useEffect, useRef } from "react"
import Artist from "../pages/Artist/Artist"

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
      className={`mt-2 mb-2 ml-2 px-6 pt-4 rounded-l-lg bg-[#121212] text-white overflow-y-auto custom-scrollbar flex-1 min-w-0
        ${isAdminPage ? "mr-2 rounded-r-lg" : "mr-0"}`}
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
        <Route path="/artist/:id" element={<Artist />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}

export default MainLayout