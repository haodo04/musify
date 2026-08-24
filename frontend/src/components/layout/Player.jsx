import { useContext } from "react";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext";
import { formatTime } from "../../utils/formatTime";
import { X, Volume2, Volume1, VolumeX } from "lucide-react";

const Player = () => {
  const {
    seekBar, seekBg, playStatus, play, pause,
    track, time, previous, next, seekSong, clearTrack,
    songsData, volume, changeVolume, toggleMute,
  } = useContext(PlayerContext);

  if (!track) return null;

  const currentIndex = songsData.findIndex((s) => s.id === track.id);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === -1 || currentIndex >= songsData.length - 1;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4 relative">

      <div className="hidden lg:flex items-center gap-4 min-w-0 w-[25%]">
        <img className="w-12 h-12 rounded object-cover shrink-0" src={track.imageUrl} alt="cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{track.title}</p>
          <p className="text-[#a7a7a7] text-xs truncate">{track.artist?.name}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
          <img
            onClick={previous}
            className={`w-4 transition ${isFirst ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
            src={assets.prev_icon}
            alt=""
            title="Bài trước"
          />
          {playStatus ? (
            <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="" />
          ) : (
            <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="" />
          )}
          <img
            onClick={next}
            className={`w-4 transition ${isLast ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
            src={assets.next_icon}
            alt=""
            title="Bài tiếp theo"
          />
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

      <div className="hidden lg:flex items-center gap-2 opacity-75 w-[25%] justify-end">
        <img className="w-4" src={assets.plays_icon} alt="" />
        <img className="w-4" src={assets.mic_icon} alt="" />
        <img className="w-4" src={assets.queue_icon} alt="" />
        <img className="w-4" src={assets.speaker_icon} alt="" />

        <div className="flex items-center gap-2 group/vol">
          <button
            onClick={toggleMute}
            className="text-[#a7a7a7] hover:text-white transition"
            title={volume === 0 ? "Bật tiếng" : "Tắt tiếng"}
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-20 h-1 accent-white cursor-pointer"
            title="Âm lượng"
          />
        </div>

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