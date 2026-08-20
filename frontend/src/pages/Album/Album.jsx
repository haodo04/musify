import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext";
import { getAlbumById } from "../../services/albumService";
import { getSongsByAlbum } from "../../services/songService";
import { Play, MoreHorizontal, PlusCircle, Clock } from "lucide-react";

const Album = () => {
  const { id } = useParams();
  const { playWithId } = useContext(PlayerContext);
  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [bgColor, setBgColor] = useState("from-neutral-700"); 

  const colors = [
    "from-red-700", "from-blue-700", "from-emerald-700", 
    "from-purple-700", "from-orange-700", "from-pink-700", "from-sky-700"
  ];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);

    const fetchData = async () => {
      try {
        const album = await getAlbumById(id);
        const albumSongs = await getSongsByAlbum(id);
        setAlbumData(album);
        setSongs(albumSongs);
      } catch (err) {
        console.error("Lỗi khi tải album:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!albumData) return <div className="text-white p-8 font-medium">Đang tải dữ liệu...</div>;

  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`-mx-6 -mt-4 bg-gradient-to-b ${bgColor} to-[#121212] min-h-[calc(100vh-100px)]`}>
      
      <div className="bg-black/20 w-full min-h-full pb-10">
        
        <div className="px-6 pt-4">
          <Navbar />
          
          <div className="mt-8 flex gap-6 flex-col md:flex-row md:items-end">
            <img 
              className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] object-cover" 
              src={albumData.coverUrl || "https://placehold.co/300x300?text=Album"} 
              alt={albumData.title} 
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold tracking-wide uppercase text-white mb-2 hidden md:block">
                Album
              </p>
              <h1 className="text-4xl md:text-[5rem] font-black mb-4 text-white tracking-tighter leading-none drop-shadow-md">
                {albumData.title}
              </h1>
              <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                {albumData.artist?.avatarUrl ? (
                  <img src={albumData.artist.avatarUrl} alt="artist" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-600"></div>
                )}
                <span className="font-bold hover:underline cursor-pointer">{albumData.artist?.name}</span>
                <span>•</span>
                <span>{albumData.releaseDate ? albumData.releaseDate.substring(0,4) : "2024"}</span>
                <span>•</span>
                <span>{songs.length} bài hát,</span>
                <span className="text-white/70 font-normal">{Math.floor(totalDuration / 60)} phút</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 mt-6 px-6 pb-20">
          
          <div className="py-6 flex items-center gap-6">
            <button className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-xl">
              <Play className="w-7 h-7 fill-black text-black ml-1.5" />
            </button>
            <PlusCircle className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" strokeWidth={1.5} />
            <MoreHorizontal className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
          </div>

          <div className="grid grid-cols-[30px_minmax(150px,1fr)_50px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px] gap-4 mb-4 pl-2 text-[#a7a7a7] text-sm border-b border-[#ffffff1a] pb-2 font-medium">
            <p className="text-right pr-2">#</p>
            <p>Tiêu đề</p>
            <p className="hidden sm:block">Thể loại</p>
            <div className="flex justify-center"><Clock className="w-4 h-4" /></div>
          </div>

          <div className="flex flex-col gap-1">
            {songs.map((item, index) => (
              <div
                key={item.id}
                onClick={() => playWithId(item.id)}
                className="grid grid-cols-[30px_minmax(150px,1fr)_50px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px] gap-4 p-2.5 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] rounded-md cursor-pointer transition group"
              >
                <div className="text-right pr-2 text-base font-medium">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 fill-white text-white hidden group-hover:inline-block ml-auto" />
                </div>
                
                <div className="flex items-center gap-3 min-w-0">
                  <img className="w-10 h-10 object-cover rounded shadow-md" src={item.imageUrl || "https://placehold.co/100x100"} alt={item.title} />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-white truncate group-hover:text-[#1db954]">{item.title}</p>
                    <p className="text-sm truncate hover:underline cursor-pointer inline-block">{item.artist?.name}</p>
                  </div>
                </div>

                <p className="text-sm hidden sm:block truncate">{item.genre || "Pop"}</p>
                
                <p className="text-sm text-center font-medium">{formatTime(item.duration)}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Album;