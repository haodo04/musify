import { Route, Routes, useLocation } from "react-router-dom"
import Home from "../pages/Home/Home"
import Album from "../pages/Album/Album"
import Library from "../pages/Library/Library"
import Playlist from "../pages/Playlist/Playlist"
import ProtectedRoute from "../routes/ProtectedRoute"
import AdminRoute from "../routes/AdminRoute"
import Admin from "../pages/Admin/Admin"
import Search from "../pages/Search/Search"
import Song from "../pages/Song/Song"
import { useEffect, useRef } from "react"
import Artist from "../pages/Artist/Artist"
import Profile from "../pages/Profile/Profile"
import Favorites from "../pages/Favorites/Favorites"

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
        <Route path="/search" element={<Search />} />
        <Route path="/song/:id" element={<Song />} />
        <Route path="/admin" element={
          <AdminRoute><Admin /></AdminRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute><Favorites /></ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default MainLayout