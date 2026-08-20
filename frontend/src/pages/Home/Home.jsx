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
import { getRecentlyPlayedIds } from "../../utils/recentlyPlayed";

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useContext(AuthContext);
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
        result.push({
          id: artist.id,
          name: artist.name,
          image: artist.avatarUrl,
        });
      }
    });
    return result;
  }, [albums, songs]);

  const recentlyPlayed = useMemo(() => {
    const ids = getRecentlyPlayedIds();
    return ids.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  }, [songs]);

  return (
    <div className="relative min-h-full pb-10 overflow-hidden">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-[#8B3A3A]/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute top-[40%] right-10 w-[400px] h-[300px] bg-[#5B21B6]/15 blur-[140px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-[450px] h-[350px] bg-[#1E3A8A]/15 blur-[150px] pointer-events-none rounded-full"></div>

      <div className="relative z-10">
        <Navbar />
        
        {isAuthenticated && (
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold text-2xl tracking-tight">Chào mừng trở lại</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg p-6 flex flex-col justify-between min-h-[180px] bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600 shadow-md">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-md">1. Bắt đầu nghe nhạc</h2>
                  <p className="text-sm text-white/90">Tìm kiếm, khám phá và phát bài hát yêu thích của bạn.</p>
                </div>
                <button
                  onClick={() => navigate("/search")}
                  className="bg-black text-white w-fit px-5 py-2 rounded-full font-bold text-sm mt-4 hover:scale-105 transition"
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="rounded-lg p-6 flex flex-col justify-between min-h-[180px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 shadow-md">
                <div>
                  <p className="text-sm text-white/80 mb-1 font-medium">Dành riêng cho</p>
                  <h2 className="text-3xl font-bold text-white drop-shadow-md">{user?.username || "bạn"}</h2>
                </div>
                <p className="text-sm text-white/90 mt-4">Danh sách nhạc được gợi ý dựa trên sở thích của bạn</p>
              </div>
            </div>
          </div>
        )}

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
            <SectionHeader title="Những bài hát thịnh hành" seeAllPath="/trending" />
            <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
              {loading ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Đang tải bài hát...</p>
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
                <p className="text-[#a7a7a7] text-sm font-medium">Đang tải nghệ sĩ...</p>
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
            <SectionHeader title="Album và đĩa đơn nổi bật" seeAllPath="/albums" />
            <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
              {loading ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Đang tải album...</p>
              ) : albums.length === 0 ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Chưa có album nào</p>
              ) : (
                albums.map((item) => (
                  <AlbumItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.coverUrl} />
                ))
              )}
            </div>
          </div>

          <div className="mb-8">
            <SectionHeader title="Bảng xếp hạng nổi bật" seeAllPath="/charts" />
            <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
              {loading ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Đang tải...</p>
              ) : charts.length === 0 ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Chưa có dữ liệu xếp hạng</p>
              ) : (
                charts.map((item) => (
                  <AlbumItem key={`chart-${item.id}`} id={item.id} name={item.title} desc={item.artist?.name} image={item.coverUrl} />
                ))
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;