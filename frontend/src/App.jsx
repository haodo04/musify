import { useContext } from "react"
import MainLayout from "./layouts/MainLayout"
import Player from "./components/layout/Player"
import Sidebar from "./components/layout/Sidebar"
import { PlayerContext } from "./context/PlayerContext"

const App = () => {
  const {audioRef,track} = useContext(PlayerContext)
  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex">
        <Sidebar/>
        <MainLayout/>
      </div>
      <Player/>
      <audio ref={audioRef} src={track.file} preload="auto">

      </audio>
    </div>
  )
}

export default App