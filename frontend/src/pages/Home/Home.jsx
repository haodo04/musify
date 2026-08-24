import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import SectionHeader from "../../components/layout/SectionHeader";
import Footer from "../../components/layout/Footer";
import AlbumItem from "../../components/cards/AlbumItem";
import SongItem from "../../components/cards/SongItem";
import ArtistItem from "../../components/cards/ArtistItem";
import { getAllAlbums, getFeaturedCharts } from "../../services/albumService";
import { getAllSongs, getTrendingSongs } from "../../services/songService";
import { AuthContext } from "../../context/AuthContext";
import { PlayerContext } from "../../context/PlayerContext";
import { getRecentlyPlayedIds } from "../../utils/recentlyPlayed";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const { isAuthenticated } = useContext(AuthContext);
  const { playWithId } = useContext(PlayerContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumsData, songsData, trendingData, chartsData] = await Promise.all([
          getAllAlbums(),
          getAllSongs(),
          getTrendingSongs(),
          getFeaturedCharts(),
        ]);
        setAlbums(albumsData);
        setSongs(songsData);
        setTrendingSongs(trendingData);
        setCharts(chartsData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const artists = useMemo(() => {
    const seen = new Set();
    const result = [];
    [...albums, ...songs].forEach((item) => {
      const artist = item.artist;
      if (artist && artist.id != null && !seen.has(artist.id)) {
        seen.add(artist.id);
        result.push({ id: artist.id, name: artist.name, image: artist.avatarUrl });
      }
    });
    return result;
  }, [albums, songs]);

  const recentlyPlayed = useMemo(() => {
    const ids = getRecentlyPlayedIds();
    return ids.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  }, [songs]);

  const featuredBanners = useMemo(() => albums.slice(0, 4), [albums]);

  const heroPalettes = useMemo(
    () => [
      { from: "#5b2a86", via: "#2c1250", accent: "#c084fc" }, 
      { from: "#a3390c", via: "#43140a", accent: "#ffb454" }, 
      { from: "#0c6b58", via: "#08281f", accent: "#34e0a1" }, 
      { from: "#8c1046", via: "#33081d", accent: "#ff6f9c" }, 
      { from: "#1b4c8c", via: "#0b1d33", accent: "#5ec8ff" },
    ],
    []
  );

  const quickPicks = useMemo(() => {
    const pool = [
      ...trendingSongs.map((s) => ({ id: `s-${s.id}`, title: s.title, sub: s.artist?.name, image: s.imageUrl, path: null })),
      ...albums.map((a) => ({ id: `a-${a.id}`, title: a.title, sub: a.artist?.name, image: a.coverUrl, path: `/album/${a.id}` })),
    ];
    return pool.slice(0, 8);
  }, [trendingSongs, albums]);

  useEffect(() => {
    if (featuredBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredBanners.length]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % featuredBanners.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + featuredBanners.length) % featuredBanners.length);

  return (
    <div className="relative min-h-full pb-10 bg-[#121212]">
      
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, ${heroPalettes[currentSlide % heroPalettes.length].via}66 0%, ${heroPalettes[currentSlide % heroPalettes.length].via}22 30%, #121212 65%, #121212 100%)`,
        }}
      ></div>

      <div className="relative z-10">
        <Navbar />

        {isAuthenticated && (
          <div className="px-6 mt-2 flex gap-2">
            {["Tất cả", "Nhạc", "Podcasts"].map((item) => (
              <button
                key={item}
                onClick={() => setActiveFilter(item)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === item ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {isAuthenticated && featuredBanners.length > 0 && (
          <div className="px-6 mt-6 mb-10 flex flex-col lg:flex-row gap-4">

            <div
              className="relative group w-full lg:w-[46%] shrink-0 h-[280px] rounded-1xl overflow-hidden shadow-2xl transition-colors duration-700"
              style={{
                background: `linear-gradient(150deg, ${heroPalettes[currentSlide % heroPalettes.length].from} 0%, ${heroPalettes[currentSlide % heroPalettes.length].via} 70%)`,
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-40 transition-colors duration-700"
                style={{ backgroundColor: heroPalettes[currentSlide % heroPalettes.length].accent }}
              />

              <div key={currentSlide} className="relative z-10 h-full flex items-center px-6 md:px-8 gap-6 animate-fadeIn">
                <img
                  src={featuredBanners[currentSlide]?.coverUrl}
                  alt={featuredBanners[currentSlide]?.title}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover shadow-[0_20px_40px_rgba(0,0,0,0.55)] rotate-[-3deg] shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <span
                    className="text-[11px] uppercase tracking-[0.2em] font-black mb-2 inline-block"
                    style={{ color: heroPalettes[currentSlide % heroPalettes.length].accent }}
                  >
                    Khám phá ngay
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-white leading-tight truncate mb-1">
                    {featuredBanners[currentSlide]?.title}
                  </h2>
                  <p className="text-white/60 mb-5 font-medium text-sm truncate">
                    {featuredBanners[currentSlide]?.artist?.name || "Nghệ sĩ độc quyền"}
                  </p>
                  <button className="bg-white hover:bg-white/90 text-black font-bold py-2.5 px-6 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                    <Play className="w-4 h-4 fill-black" /> Phát
                  </button>
                </div>
              </div>

              <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 flex gap-1.5 z-20">
                {featuredBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentSlide ? "w-6" : "w-3 bg-white/25"}`}
                    style={idx === currentSlide ? { backgroundColor: heroPalettes[currentSlide % heroPalettes.length].accent } : undefined}
                  />
                ))}
              </div>
            </div>

            {quickPicks.length > 0 && (
              <div className="flex-1 min-w-0 flex gap-3 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
                {quickPicks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => item.path && navigate(item.path)}
                    className="group/pick relative shrink-0 w-[130px] h-[280px] rounded-2xl overflow-hidden bg-[#181818] hover:bg-[#232323] cursor-pointer transition-colors flex flex-col"
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/pick:scale-105 transition-transform duration-500"
                      />
                      <button className="absolute bottom-2 right-2 bg-[#1db954] text-black rounded-full p-2 shadow-lg opacity-0 translate-y-2 group-hover/pick:opacity-100 group-hover/pick:translate-y-0 transition-all">
                        <Play className="w-4 h-4 fill-black" />
                      </button>
                    </div>
                    <div className="p-3 flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                      <p className="text-[#a7a7a7] text-xs truncate mt-0.5">{item.sub || "Đang cập nhật"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-6">
          <div className={`${!isAuthenticated ? "mt-6" : ""} mb-8`}>
            
            {isAuthenticated && recentlyPlayed.length > 0 && (
              <div className="mb-8">
                <SectionHeader title="Nghe gần đây" />
                <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                  {recentlyPlayed.map((item) => (
                    <SongItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.imageUrl} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <SectionHeader title="Thịnh hành ngay bây giờ" seeAllPath="/trending" />
              <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                {loading ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Đang tải...</p>
                ) : trendingSongs.length === 0 ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Chưa có bài hát nào</p>
                ) : (
                  trendingSongs.map((item) => (
                    <SongItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.imageUrl} />
                  ))
                )}
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader title="Nghệ sĩ phổ biến" seeAllPath="/artists" />
              <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                {loading ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Đang tải...</p>
                ) : artists.length === 0 ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Chưa có nghệ sĩ nào</p>
                ) : (
                  artists.map((item) => (
                    <ArtistItem key={item.id} id={item.id} name={item.name} image={item.image} />
                  ))
                )}
              </div>
            </div>

            <div className="mb-8">
              <SectionHeader title="Album & Đĩa đơn" seeAllPath="/albums" />
              <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                {loading ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Đang tải...</p>
                ) : albums.length === 0 ? (
                  <p className="text-[#a7a7a7] text-sm font-medium">Chưa có album nào</p>
                ) : (
                  albums.map((item) => (
                    <AlbumItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.coverUrl} />
                  ))
                )}
              </div>
            </div>
            
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;