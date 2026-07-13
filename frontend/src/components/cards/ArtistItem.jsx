// src/components/cards/ArtistItem.jsx
import { useNavigate } from "react-router-dom";

const ArtistItem = ({ id, name, image }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artist/${id}`)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] flex flex-col items-center text-center"
    >
      <img
        className="rounded-full w-32 h-32 object-cover"
        src={image}
        alt={name}
      />
      <p className="font-bold mt-2 mb-1 truncate w-full">{name}</p>
      <p className="text-slate-200 text-sm">Nghệ sĩ</p>
    </div>
  );
};

export default ArtistItem;