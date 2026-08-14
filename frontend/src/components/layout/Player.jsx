import { useContext } from "react";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext";
import { formatTime } from "../../utils/formatTime";
import { X } from "lucide-react";

const Player = () => {
  const {
    seekBar, seekBg, playStatus, play, pause,
    track, time, previous, next, seekSong, clearTrack,
  } = useContext(PlayerContext);

  if (!track) return null;

  return (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4 relative">

      {/* Bài đang phát */}
      <div className="hidden lg:flex items-center gap-4 min-w-0 w-[25%]">
        <img className="w-12 h-12 rounded object-cover shrink-0" src={track.imageUrl} alt="cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{track.title}</p>
          <p className="text-[#a7a7a7] text-xs truncate">{track.artist?.name}</p>
        </div>
      </div>

      {/* Controls + seekbar */}
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
          <img onClick={previous} className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
          {playStatus ? (
            <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="" />
          ) : (
            <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="" />
          )}
          <img onClick={next} className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
          <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
        </div>
        <div className="flex items-center gap-5">
          <p className="text-xs text-[#a7a7a7]">{formatTime(time.currentTime)}</p>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr ref={seekBar} className="h-1 border-none w-0 bg-green-800 rounded-full" />
          </div>
          <p className="text-xs text-[#a7a7a7]">{formatTime(time.totalTime)}</p>
        </div>
      </div>

      {/* Right controls + nút X */}
      <div className="hidden lg:flex items-center gap-2 opacity-75 w-[25%] justify-end">
        <img className="w-4" src={assets.plays_icon} alt="" />
        <img className="w-4" src={assets.mic_icon} alt="" />
        <img className="w-4" src={assets.queue_icon} alt="" />
        <img className="w-4" src={assets.speaker_icon} alt="" />
        <img className="w-4" src={assets.volume_icon} alt="" />
        <div className="w-20 bg-slate-50 h-1 rounded" />
        <img className="w-4" src={assets.mini_player_icon} alt="" />
        <img className="w-4" src={assets.zoom_icon} alt="" />

        <button
          onClick={clearTrack}
          title="Đóng player"
          className="ml-2 opacity-100 w-6 h-6 rounded-full flex items-center justify-center
            text-[#a7a7a7] hover:text-white hover:bg-[#333] transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Player;