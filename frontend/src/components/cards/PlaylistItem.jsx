import { useNavigate } from "react-router-dom";
import { Play, Trash2 } from "lucide-react";

const PlaylistItem = ({ id, name, description, image, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <div
      onClick={() => navigate(`/playlist/${id}`)}
      className="relative min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] p-3.5 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-all duration-300 group"
    >
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          title="Xoá playlist"
          className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-500/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="relative w-full mb-3">

        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          />
        ) : (
          <div className="w-full aspect-square bg-[#282828] rounded-md flex items-center justify-center text-5xl shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            🎵
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]">
          <Play className="w-6 h-6 fill-black text-black ml-1" />
        </div>
      </div>
      
      <p className="font-bold text-[15px] text-white truncate mb-1">{name}</p>
      <p className="text-[13px] text-[#a7a7a7] line-clamp-2 leading-tight">{description || "Playlist của bạn"}</p>
    </div>
  );
};

export default PlaylistItem;