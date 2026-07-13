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
  const { user } = useContext(AuthContext);
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
    <>
      <Navbar />

      <div className="mt-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-2xl">Bắt đầu nghe nhạc</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-6 flex flex-col justify-between min-h-[180px] bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-600">
            <div>
              <h2 className="text-2xl font-bold mb-2">1. Bắt đầu nghe nhạc</h2>
              <p className="text-sm text-white/90">Tìm kiếm, khám phá và phát bài hát yêu thích của bạn.</p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="bg-black text-white w-fit px-5 py-2 rounded-full font-bold text-sm mt-4 hover:scale-105 transition"
            >
              Tìm kiếm
            </button>
          </div>
          <div className="rounded-lg p-6 flex flex-col justify-between min-h-[180px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700">
            <div>
              <p className="text-sm text-white/80 mb-1">Dành riêng cho</p>
              <h2 className="text-2xl font-bold">{user?.username || "bạn"}</h2>
            </div>
            <p className="text-sm text-white/90 mt-4">Danh sách nhạc được gợi ý dựa trên sở thích của bạn</p>
          </div>
        </div>
      </div>

      {user && recentlyPlayed.length > 0 && (
        <div className="mb-8">
          <SectionHeader title="Nghe gần đây" />
          <div className="flex overflow-auto">
            {recentlyPlayed.map((item) => (
              <SongItem
                key={item.id}
                id={item.id}
                name={item.title}
                desc={item.artist?.name}
                image={item.imageUrl}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <SectionHeader title="Bài hát thịnh hành" seeAllPath="/trending" />
        <div className="flex overflow-auto">
          {loading ? (
            <p className="text-gray-400 text-sm">Đang tải bài hát...</p>
          ) : trendingSongs.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có bài hát nào</p>
          ) : (
            trendingSongs.map((item) => (
              <SongItem
                key={item.id}
                id={item.id}
                name={item.title}
                desc={item.artist?.name}
                image={item.imageUrl}
              />
            ))
          )}
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="Nghệ sĩ nổi bật" seeAllPath="/artists" />
        <div className="flex overflow-auto">
          {loading ? (
            <p className="text-gray-400 text-sm">Đang tải nghệ sĩ...</p>
          ) : artists.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có nghệ sĩ nào</p>
          ) : (
            artists.map((item) => (
              <ArtistItem key={item.id} id={item.id} name={item.name} image={item.image} />
            ))
          )}
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="Album và đĩa đơn nổi bật" seeAllPath="/albums" />
        <div className="flex overflow-auto">
          {loading ? (
            <p className="text-gray-400 text-sm">Đang tải album...</p>
          ) : albums.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có album nào</p>
          ) : (
            albums.map((item) => (
              <AlbumItem
                key={item.id}
                id={item.id}
                name={item.title}
                desc={item.artist?.name}
                image={item.coverUrl}
              />
            ))
          )}
        </div>
      </div>

      <div className="mb-8">
        <SectionHeader title="Bảng xếp hạng nổi bật" seeAllPath="/charts" />
        <div className="flex overflow-auto">
          {loading ? (
            <p className="text-gray-400 text-sm">Đang tải...</p>
          ) : charts.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có dữ liệu xếp hạng</p>
          ) : (
            charts.map((item) => (
              <AlbumItem
                key={`chart-${item.id}`}
                id={item.id}
                name={item.title}
                desc={item.artist?.name}
                image={item.coverUrl}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;