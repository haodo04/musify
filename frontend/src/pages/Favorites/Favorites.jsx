import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { getMyFavorites } from "../../services/favoriteService";
import { Heart, Pause, Play } from "lucide-react";

const Favorites = () => {
  const navigate = useNavigate();
  const { playWithId, track, playStatus } = useContext(PlayerContext);
  const { toggleFavorite, favoriteIds, loading: favoritesLoading } = useContext(FavoriteContext);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getMyFavorites();
      setSongs(data);
    } catch (err) {
      console.error("Lỗi khi tải bài hát yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (!favoritesLoading) {
      setSongs((prev) => prev.filter((s) => favoriteIds.has(s.id)));
    }
  }, [favoriteIds]);

  const handleUnfavorite = (songId) => {
    toggleFavorite(songId);
  };

  const firstSongImage = songs.length > 0 ? songs[0].imageUrl : null;
  const totalDuration = songs.reduce((acc, s) => acc + (s.duration || 0), 0);

  if (loading) {
    return <div className="p-4 text-white">Đang tải...</div>;
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-10">
      <Navbar />

      <div className="mt-10 px-8 flex gap-8 flex-col md:flex-row md:items-end">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-indigo-900 rounded shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
          {firstSongImage ? (
            <img src={firstSongImage} alt="Cover" className="w-full h-full object-cover opacity-70" />
          ) : (
            <Heart className="w-16 h-16 text-white fill-white" />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-bold uppercase mb-2">Danh sách phát</p>
          <h2 className="text-5xl font-black mb-4 md:text-7xl tracking-tighter">Bài hát đã thích</h2>
          <p className="mt-2 text-[#a7a7a7] font-bold text-sm">
            {songs.length} bài hát{totalDuration > 0 ? `, ${Math.floor(totalDuration / 60)} phút` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6 px-8">
        <button
          onClick={() => songs.length > 0 && playWithId(songs[0].id, songs)}
          disabled={songs.length === 0}
          className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-xl disabled:opacity-40 disabled:cursor-default"
        >
          {playStatus && songs.some((s) => s.id === track?.id) ? (
            <Pause className="w-7 h-7 fill-black text-black" />
          ) : (
            <Play className="w-7 h-7 fill-black text-black ml-1.5" />
          )}
        </button>
      </div>

      <div className="px-8 mt-4">
        <div className="grid grid-cols-[50px_minmax(200px,1fr)_minmax(150px,1fr)_100px] mb-4 text-[#a7a7a7] text-sm font-medium border-b border-[#282828] pb-2 px-2">
          <p className="text-center">#</p>
          <p>Tiêu đề</p>
          <p className="hidden md:block">Thể loại</p>
          <p className="text-center">Thời lượng</p>
        </div>

        {songs.length === 0 ? (
          <div className="text-center mt-10 flex flex-col items-center gap-3">
            <p className="text-[#a7a7a7]">Bạn chưa thích bài hát nào.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition"
            >
              Khám phá bài hát
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {songs.map((item, index) => {
              const isActive = track?.id === item.id;
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[50px_minmax(200px,1fr)_minmax(150px,1fr)_100px] gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#282828] rounded-md group transition"
                >
                  <div className="text-center font-medium">
                    {isActive && playStatus ? (
                      <Pause className="w-4 h-4 fill-[#1db954] text-[#1db954] mx-auto" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div
                    onClick={() => playWithId(item.id, songs)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img className="w-10 h-10 object-cover rounded shadow-md" src={item.imageUrl || "https://placehold.co/100x100"} alt={item.title} />
                    <div className="flex flex-col min-w-0">
                      <span className={`font-medium truncate ${isActive ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>{item.title}</span>
                      <span className="text-[13px] truncate">{item.artist?.name}</span>
                    </div>
                  </div>

                  <p className="text-[14px] hidden md:block truncate">{item.genre}</p>

                  <div className="flex items-center justify-between px-2">
                    <p className="text-[14px]">{item.duration}s</p>
                    <button
                      onClick={() => handleUnfavorite(item.id)}
                      title="Xoá khỏi yêu thích"
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;