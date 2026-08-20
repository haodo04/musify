import { useContext } from "react"
import { useLocation } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import TopBar from "./components/layout/TopBar"
import Player from "./components/layout/Player"
import Sidebar from "./components/layout/Sidebar"
import { PlayerContext } from "./context/PlayerContext"

const App = () => {
  const { audioRef, track } = useContext(PlayerContext)
  const location = useLocation();
  
  // Xác định các layout đặc biệt
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  // Dùng startsWith để bao quát cả các trang con của admin sau này (nếu có)
  const isAdminPage = location.pathname.startsWith("/admin"); 

  // Nếu là trang Login / Register thì chỉ render AuthLayout (không Sidebar, không TopBar, không Player)
  if (isAuthPage) {
    return <AuthLayout />;
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Chỉ hiển thị TopBar ở luồng người dùng bình thường, ẩn ở trang Admin */}
      {!isAdminPage && <TopBar />}
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chỉ hiển thị Sidebar của User ở luồng bình thường */}
        {!isAdminPage && <Sidebar />}
        
        {/* MainLayout (chứa <Routes>) */}
        <MainLayout />
      </div>

      {/* Trình phát nhạc: Luôn hiện ở trang User, ẩn ở trang Admin trừ khi đang có bài hát được Play thử */}
      {(!isAdminPage || track) && <Player />}

      {/* Thẻ audio ẩn để phát nhạc */}
      {track && (
        <audio ref={audioRef} src={track.audioUrl} preload="auto"></audio>
      )}
    </div>
  )
}

export default App