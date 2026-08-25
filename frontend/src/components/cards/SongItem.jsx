import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { AuthContext } from "../../context/AuthContext";
import { Play, Pause, Heart } from "lucide-react";

const SongItem = ({ name, image, desc, id, queue }) => {
  const { playWithId, track, playStatus } = useContext(PlayerContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const isActive = track?.id === id;
  const isPlayingThis = isActive && playStatus;
  const favorited = isFavorite(id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    playWithId(id, queue);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleCardClick = () => {
    navigate(`/song/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] p-3.5 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-all duration-300 group"
    >
      <div className="relative w-full mb-3">

        <img 
          src={image || "https://placehold.co/200x200?text=Song"} 
          alt={name} 
          className="w-full aspect-square object-cover rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]" 
        />

        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            title={favorited ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all ${
              favorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        )}
        
        <div
          onClick={handlePlayClick}
          className={`absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760] ${
            isActive ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isPlayingThis ? (
            <Pause className="w-6 h-6 fill-black text-black" />
          ) : (
            <Play className="w-6 h-6 fill-black text-black ml-1" />
          )}
        </div>
      </div>
      
      <p className={`font-bold text-[15px] truncate mb-1 ${isActive ? "text-[#1db954]" : "text-white"}`}>
        {name}
      </p>
      <p className="text-[13px] text-[#a7a7a7] line-clamp-2 leading-tight">{desc}</p>
    </div>
  );
};

export default SongItem;