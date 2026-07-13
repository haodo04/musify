import { useContext } from "react"
import { useLocation } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import TopBar from "./components/layout/TopBar"
import Player from "./components/layout/Player"
import Sidebar from "./components/layout/Sidebar"
import { PlayerContext } from "./context/PlayerContext"

const App = () => {
  const {audioRef,track} = useContext(PlayerContext)
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <AuthLayout/>;
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      <TopBar/>
      <div className="flex-1 flex overflow-hidden">
        <Sidebar/>
        <MainLayout/>
      </div>
      <Player/>
      {track && (
        <audio ref={audioRef} src={track.audioUrl} preload="auto"></audio>
      )}
    </div>
  )
}

export default App