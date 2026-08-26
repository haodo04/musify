import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import AddToPlaylistModal from "../../components/modals/AddToPlaylistModal";
import SongItem from "../../components/cards/SongItem";
import { PlayerContext } from "../../context/PlayerContext";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { getSongById, getSimilarSongs } from "../../services/songService";
import { Play, Pause, MoreHorizontal, PlusCircle, Clock, X, Heart } from "lucide-react";

const colors = [
  "from-red-800", "from-blue-800", "from-emerald-800",
  "from-purple-800", "from-amber-800", "from-pink-800",
  "from-cyan-800", "from-indigo-800",
];

const formatDurationRow = (seconds) => {
  if (seconds == null) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatDurationLabel = (seconds) => {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m} phút ${s} giây`;
};

const Song = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithId, track, playStatus } = useContext(PlayerContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);

  const [songData, setSongData] = useState(null);
  const [similarSongs, setSimilarSongs] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const bgColor = colors[Math.abs(Number(id) || 0) % colors.length];
  const isThisPlaying = track?.id === songData?.id && playStatus;
  const isThisFavorite = isAuthenticated && songData ? isFavorite(songData.id) : false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const song = await getSongById(id);
        setSongData(song);
      } catch (err) {
        console.error("Lỗi khi tải bài hát:", err);
        setSongData(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!songData) return;
    getSimilarSongs(songData.id, 6)
      .then(setSimilarSongs)
      .catch(() => setSimilarSongs([]));
  }, [songData?.id]);

  const handlePlay = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (songData) playWithId(songData.id);
  };

  const handleAddToPlaylistClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowAddToPlaylist(true);
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite(songData.id);
  };

  if (loading) {
    return <div className="text-white p-8 font-medium">Đang tải dữ liệu...</div>;
  }

  if (notFound || !songData) {
    return (
      <div className="text-white p-8 flex flex-col items-center text-center gap-3 mt-10">
        <p className="font-bold text-xl">Không tìm thấy bài hát này</p>
        <p className="text-[#a7a7a7] text-sm">Bài hát có thể đã bị xoá hoặc đường dẫn không đúng.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-white text-black font-bold px-5 py-2 rounded-full hover:scale-105 transition"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className={`-mx-6 -mt-4 bg-gradient-to-b ${bgColor} to-[#121212] min-h-[calc(100vh-100px)] relative`}>
      <div className="bg-black/20 w-full min-h-full pb-10">

        <div className="px-6 pt-4">
          <Navbar />

          <div className="mt-8 flex gap-6 flex-col md:flex-row md:items-end">
            <img
              className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-[0_8px_40px_rgba(0,0,0,0.6)] object-cover"
              src={songData.imageUrl || "https://placehold.co/300x300?text=Song"}
              alt={songData.title}
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold tracking-wider uppercase text-white mb-2 hidden md:block">
                Đĩa đơn
              </p>
              <h1 className="text-4xl md:text-[5rem] font-black mb-4 text-white tracking-tighter leading-none drop-shadow-lg">
                {songData.title}
              </h1>
              <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                {songData.artist?.avatarUrl ? (
                  <img src={songData.artist.avatarUrl} alt="artist" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-600"></div>
                )}
                <span className="font-bold hover:underline cursor-pointer">{songData.artist?.name}</span>
                <span>•</span>
                <span>1 bài hát, {formatDurationLabel(songData.duration)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 mt-6 px-6 pb-20">
          <div className="py-6 flex items-center gap-6">
            <button
              onClick={handlePlay}
              className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-xl cursor-pointer"
            >
              {isThisPlaying ? (
                <Pause className="w-7 h-7 fill-black text-black" />
              ) : (
                <Play className="w-7 h-7 fill-black text-black ml-1.5" />
              )}
            </button>

            <Heart
              onClick={handleFavoriteClick}
              className={`w-8 h-8 cursor-pointer transition hover:scale-105 ${
                isThisFavorite ? "fill-red-500 text-red-500" : "text-[#a7a7a7] hover:text-white"
              }`}
              strokeWidth={1.5}
              title={isThisFavorite ? "Xoá khỏi bài hát yêu thích" : "Thêm vào bài hát yêu thích"}
            />

            <PlusCircle
              onClick={handleAddToPlaylistClick}
              className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition"
              strokeWidth={1.5}
              title="Thêm vào playlist"
            />

            <MoreHorizontal className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
          </div>

          <div className="grid grid-cols-[30px_minmax(150px,1fr)_50px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px] gap-4 mb-4 pl-2 text-[#a7a7a7] text-sm border-b border-[#ffffff1a] pb-2 font-medium">
            <p className="text-right pr-2">#</p>
            <p>Tiêu đề</p>
            <p className="hidden sm:block">Thể loại</p>
            <div className="flex justify-center"><Clock className="w-4 h-4" /></div>
          </div>

          <div
            onClick={handlePlay}
            className="grid grid-cols-[30px_minmax(150px,1fr)_50px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px] gap-4 p-2.5 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] rounded-md cursor-pointer transition group"
          >
            <div className="text-right pr-2 text-base font-medium">
              {isThisPlaying ? (
                <Pause className="w-4 h-4 fill-[#1db954] text-[#1db954] ml-auto" />
              ) : (
                <>
                  <span className="group-hover:hidden">1</span>
                  <Play className="w-4 h-4 fill-white text-white hidden group-hover:inline-block ml-auto" />
                </>
              )}
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <img
                className="w-10 h-10 object-cover rounded shadow-md"
                src={songData.imageUrl || "https://placehold.co/100x100"}
                alt={songData.title}
              />
              <div className="min-w-0 flex-1">
                <p className={`text-base font-medium truncate ${isThisPlaying ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>
                  {songData.title}
                </p>
                <p className="text-sm truncate hover:underline cursor-pointer inline-block">
                  {songData.artist?.name}
                </p>
              </div>
            </div>

            <p className="text-sm hidden sm:block truncate">{songData.genre || "Pop"}</p>
            <p className="text-sm text-center font-medium">{formatDurationRow(songData.duration)}</p>
          </div>

          {similarSongs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-white mb-4">Bài hát tương tự</h2>
              <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                {similarSongs.map((item) => (
                  <SongItem
                    key={item.id}
                    id={item.id}
                    name={item.title}
                    desc={item.artist?.name}
                    image={item.imageUrl}
                    queue={similarSongs}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddToPlaylist && (
        <AddToPlaylistModal songId={songData.id} onClose={() => setShowAddToPlaylist(false)} />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute w-[350px] h-[250px] bg-[#1db954]/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="bg-[#181818] border border-[#282828] text-white rounded-2xl max-w-xl w-full p-6 md:p-7 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row items-center gap-6 z-10">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-[#a7a7a7] hover:text-white p-1.5 rounded-full hover:bg-[#282828] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-36 h-36 md:w-44 md:h-44 shrink-0 rounded-xl overflow-hidden shadow-xl relative group">
              <img
                src={songData.imageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop"}
                alt="cover"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                Bắt đầu nghe trên Musify
              </h2>
              <p className="text-[#a7a7a7] text-xs md:text-sm leading-relaxed mb-5 font-medium">
                Đăng nhập hoặc đăng ký miễn phí để nghe bài hát này.
              </p>
              <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 md:flex-initial bg-[#1db954] text-black font-extrabold px-5 py-2.5 rounded-full hover:scale-105 hover:bg-[#1ed760] transition-all text-xs md:text-sm cursor-pointer whitespace-nowrap shadow-lg"
                >
                  Đăng ký miễn phí
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 md:flex-initial border border-[#727272] hover:border-white text-white font-extrabold px-5 py-2.5 rounded-full hover:scale-105 transition-all text-xs md:text-sm cursor-pointer whitespace-nowrap"
                >
                  Đăng nhập
                </button>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="mt-4 text-xs md:text-sm font-bold text-[#a7a7a7] hover:text-white transition cursor-pointer hover:underline"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Song;