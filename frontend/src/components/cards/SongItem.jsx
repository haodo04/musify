import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Play } from "lucide-react";

const SongItem = ({ name, image, desc, id }) => {
  const { playWithId } = useContext(PlayerContext);

  return (
    <div 
      onClick={() => playWithId(id)} 
      className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] p-3.5 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-all duration-300 group"
    >
      <div className="relative w-full mb-3">

        <img 
          src={image || "https://placehold.co/200x200?text=Song"} 
          alt={name} 
          className="w-full aspect-square object-cover rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)]" 
        />
        
        <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1ed760]">
          <Play className="w-6 h-6 fill-black text-black ml-1" />
        </div>
      </div>
      
      <p className="font-bold text-[15px] text-white truncate mb-1">{name}</p>
      <p className="text-[13px] text-[#a7a7a7] line-clamp-2 leading-tight">{desc}</p>
    </div>
  );
};

export default SongItem;