import { useNavigate } from "react-router-dom";

const PlaylistItem = ({ id, name, description }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/playlist/${id}`)}
      className="min-w-[180px] p-3 rounded cursor-pointer bg-[#181818] hover:bg-[#282828] transition"
    >
      <div className="w-full aspect-square bg-[#333] rounded mb-3 flex items-center justify-center text-4xl">
        🎵
      </div>
      <p className="font-bold mb-1 truncate">{name}</p>
      <p className="text-[#a7a7a7] text-sm truncate">{description || "Playlist của bạn"}</p>
    </div>
  );
};

export default PlaylistItem;