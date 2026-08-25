import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import AddToPlaylistModal from "../../components/modals/AddToPlaylistModal";
import { PlayerContext } from "../../context/PlayerContext";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { getAlbumById } from "../../services/albumService";
import { getSongsByAlbum } from "../../services/songService";
import { Play, Pause, Shuffle, MoreHorizontal, PlusCircle, Clock, X, Heart } from "lucide-react";

const Album = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithId, track, playStatus } = useContext(PlayerContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);

  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [bgColor, setBgColor] = useState("from-neutral-700");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [addToPlaylistSongId, setAddToPlaylistSongId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const colors = [
    "from-red-800", "from-blue-800", "from-emerald-800", 
    "from-purple-800", "from-amber-800", "from-pink-800", "from-cyan-800"
  ];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);

    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const album = await getAlbumById(id);
        const albumSongs = await getSongsByAlbum(id);
        setAlbumData(album);
        setSongs(albumSongs);
      } catch (err) {
        console.error("Lỗi khi tải album:", err);
        setAlbumData(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlayAlbum = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (songs.length > 0) {
      playWithId(songs[0].id, songs);
    }
  };

  const handleShuffleAlbum = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      playWithId(songs[randomIndex].id, songs);
    }
  };

  const handleSongClick = (songId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    playWithId(songId, songs);
  };

  const handleAddToPlaylistClick = (e, songId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setAddToPlaylistSongId(songId);
  };

  const handleFavoriteClick = (e, songId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite(songId);
  };

  if (loading) {
    return <div className="text-white p-8 font-medium">Đang tải dữ liệu...</div>;
  }

  if (notFound || !albumData) {
    return (
      <div className="text-white p-8 flex flex-col items-center text-center gap-3 mt-10">
        <p className="font-bold text-xl">Không tìm thấy album này</p>
        <p className="text-[#a7a7a7] text-sm">Album có thể đã bị xoá hoặc đường dẫn không đúng.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 bg-white text-black font-bold px-5 py-2 rounded-full hover:scale-105 transition"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const totalDuration = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`-mx-6 -mt-4 bg-gradient-to-b ${bgColor} to-[#121212] min-h-[calc(100vh-100px)] relative`}>
      <div className="bg-black/20 w-full min-h-full pb-10">
        
        <div className="px-6 pt-4">
          <Navbar />
          
          <div className="mt-8 flex gap-6 flex-col md:flex-row md:items-end">
            <img 
              className="w-48 h-48 md:w-56 md:h-56 rounded-md shadow-[0_8px_40px_rgba(0,0,0,0.6)] object-cover" 
              src={albumData.coverUrl || "https://placehold.co/300x300?text=Album"} 
              alt={albumData.title} 
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold tracking-wider uppercase text-white mb-2 hidden md:block">
                Album
              </p>
              <h1 className="text-4xl md:text-[5rem] font-black mb-4 text-white tracking-tighter leading-none drop-shadow-lg">
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
            <button 
              onClick={handlePlayAlbum}
              className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-xl cursor-pointer"
            >
              {playStatus && songs.some((s) => s.id === track?.id) ? (
                <Pause className="w-7 h-7 fill-black text-black" />
              ) : (
                <Play className="w-7 h-7 fill-black text-black ml-1.5" />
              )}
            </button>

            <button 
              onClick={handleShuffleAlbum}
              className="p-1 text-[#1db954] hover:text-[#1ed760] hover:scale-110 transition cursor-pointer"
              title="Trộn bài"
            >
              <Shuffle className="w-8 h-8" />
            </button>

            <PlusCircle 
              onClick={() => !isAuthenticated && setShowAuthModal(true)}
              className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" 
              strokeWidth={1.5} 
            />

            <MoreHorizontal className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
          </div>

          <div className="grid grid-cols-[30px_minmax(150px,1fr)_50px_56px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px_64px] gap-2 sm:gap-4 mb-4 pl-2 text-[#a7a7a7] text-sm border-b border-[#ffffff1a] pb-2 font-medium">
            <p className="text-right pr-2">#</p>
            <p>Tiêu đề</p>
            <p className="hidden sm:block">Thể loại</p>
            <div className="flex justify-center"><Clock className="w-4 h-4" /></div>
            <div></div>
          </div>

          <div className="flex flex-col gap-1">
            {songs.map((item, index) => {
              const isActive = track?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSongClick(item.id)}
                  className="grid grid-cols-[30px_minmax(150px,1fr)_50px_56px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px_64px] gap-2 sm:gap-4 p-2.5 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] rounded-md cursor-pointer transition group"
                >
                  <div className="text-right pr-2 text-base font-medium">
                    {isActive && playStatus ? (
                      <Pause className="w-4 h-4 fill-[#1db954] text-[#1db954] ml-auto" />
                    ) : (
                      <>
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 fill-white text-white hidden group-hover:inline-block ml-auto" />
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <img className="w-10 h-10 object-cover rounded shadow-md" src={item.imageUrl || "https://placehold.co/100x100"} alt={item.title} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-base font-medium truncate ${isActive ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>{item.title}</p>
                      <p className="text-sm truncate hover:underline cursor-pointer inline-block">{item.artist?.name}</p>
                    </div>
                  </div>

                  <p className="text-sm hidden sm:block truncate">{item.genre || "Pop"}</p>
                  <p className="text-sm text-center font-medium">{formatTime(item.duration)}</p>

                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => handleFavoriteClick(e, item.id)}
                      title={isFavorite(item.id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
                      className={`text-[#a7a7a7] hover:text-white transition p-1 ${
                        isFavorite(item.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleAddToPlaylistClick(e, item.id)}
                      title="Thêm vào playlist"
                      className="opacity-0 group-hover:opacity-100 text-[#a7a7a7] hover:text-white transition p-1"
                    >
                      <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {addToPlaylistSongId && (
        <AddToPlaylistModal songId={addToPlaylistSongId} onClose={() => setAddToPlaylistSongId(null)} />
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
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" 
                alt="Musify Concert Vibe" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                Bắt đầu nghe trên Musify
              </h2>
              
              <p className="text-[#a7a7a7] text-xs md:text-sm leading-relaxed mb-5 font-medium">
                Đăng nhập hoặc đăng ký miễn phí để nghe trọn vẹn album này.
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

export default Album;