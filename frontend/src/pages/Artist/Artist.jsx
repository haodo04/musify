import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { PlayerContext } from "../../context/PlayerContext";
import { AuthContext } from "../../context/AuthContext";
import { getArtistById } from "../../services/artistService";
import { getSongsByArtist } from "../../services/songService";
import { Play, Shuffle, MoreHorizontal, Clock, X } from "lucide-react";

const Artist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithId } = useContext(PlayerContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [artistData, setArtistData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [bgColor, setBgColor] = useState("from-neutral-800");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const colors = [
    "from-red-800", "from-blue-800", "from-emerald-800", 
    "from-purple-800", "from-amber-800", "from-pink-800", "from-cyan-800"
  ];

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);

    const fetchData = async () => {
      try {
        if (getArtistById) {
          const artist = await getArtistById(id);
          setArtistData(artist);
        }
        if (getSongsByArtist) {
          const artistSongs = await getSongsByArtist(id);
          setSongs(artistSongs || []);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin nghệ sĩ:", err);
      }
    };
    fetchData();
  }, [id]);

  const handlePlayArtist = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (songs.length > 0) {
      playWithId(songs[0].id);
    }
  };

  // Xử lý trộn bài ngẫu nhiên
  const handleShuffleArtist = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      playWithId(songs[randomIndex].id);
    }
  };

  // Xử lý nút Theo dõi
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsFollowing(!isFollowing);
  };

  // Xử lý khi nhấn vào bài hát
  const handleSongClick = (songId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    playWithId(songId);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "3:45";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const artistAvatar = artistData?.avatarUrl || artistData?.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop";

  return (
    <div className={`-mx-6 -mt-4 bg-gradient-to-b ${bgColor} to-[#121212] min-h-[calc(100vh-100px)] relative`}>
      <div className="bg-black/20 w-full min-h-full pb-10">
        
        <div className="px-6 pt-4">
          <Navbar />
          
          <div className="mt-6 md:mt-8 flex gap-6 flex-col sm:flex-row sm:items-end">
            <img 
              className="w-36 h-36 md:w-44 md:h-44 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] object-cover shrink-0" 
              src={artistAvatar} 
              alt={artistData?.name || "Nghệ sĩ"} 
            />
            
            <div className="flex flex-col justify-end">
              <p className="text-xs md:text-sm font-bold tracking-wider uppercase text-white mb-1 hidden sm:block">
                Nghệ sĩ
              </p>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-3 text-white tracking-tight leading-none drop-shadow-md">
                {artistData?.name || "Nghệ sĩ"}
              </h1>

              <p className="text-xs md:text-sm font-medium text-white/80">
                {artistData?.monthlyListeners || "2.485.120"} người nghe hàng tháng
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 mt-6 px-6 pb-20">
          
          <div className="py-6 flex items-center gap-6">
            <button 
              onClick={handlePlayArtist}
              className="w-14 h-14 bg-[#1db954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-xl cursor-pointer"
            >
              <Play className="w-7 h-7 fill-black text-black ml-1.5" />
            </button>

            <button 
              onClick={handleShuffleArtist}
              className="p-1 text-[#1db954] hover:text-[#1ed760] hover:scale-110 transition cursor-pointer"
              title="Trộn bài"
            >
              <Shuffle className="w-8 h-8" />
            </button>

            <button
              onClick={handleFollowToggle}
              className={`px-5 py-2 rounded-full font-bold text-xs md:text-sm border transition-all hover:scale-105 cursor-pointer whitespace-nowrap ${
                isFollowing 
                  ? "border-[#1db954] text-[#1db954] hover:border-white hover:text-white" 
                  : "border-[#727272] text-white hover:border-white"
              }`}
            >
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </button>

            <MoreHorizontal className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
          </div>

          <div className="grid grid-cols-[30px_minmax(150px,1fr)_50px] sm:grid-cols-[40px_minmax(200px,1fr)_minmax(100px,1fr)_80px] gap-4 mb-4 pl-2 text-[#a7a7a7] text-sm border-b border-[#ffffff1a] pb-2 font-medium">
            <p className="text-right pr-2">#</p>
            <p>Tiêu đề</p>
            <p className="hidden sm:block">Thể loại</p>
            <div className="flex justify-center"><Clock className="w-4 h-4" /></div>
          </div>

          {songs.length === 0 ? (
            <p className="text-[#a7a7a7] text-sm py-4">Chưa có bài hát nào của nghệ sĩ này.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {songs.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleSongClick(item.id)}
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
                    </div>
                  </div>

                  <p className="text-sm hidden sm:block truncate">{item.genre || "Pop"}</p>
                  <p className="text-sm text-center font-medium">{formatTime(item.duration)}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

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
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop" 
                alt="Musify Artist Vibe" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug mb-2">
                Bắt đầu nghe trên Musify
              </h2>
              
              <p className="text-[#a7a7a7] text-xs md:text-sm leading-relaxed mb-5 font-medium">
                Đăng nhập hoặc đăng ký miễn phí để nghe nhạc và theo dõi nghệ sĩ này.
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

export default Artist;