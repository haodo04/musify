import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import AlbumItem from "../../components/cards/AlbumItem";
import SongItem from "../../components/cards/SongItem";
import { getAllAlbums } from "../../services/albumService";
import { getAllSongs } from "../../services/songService";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumsData = await getAllAlbums();
        const songsData = await getAllSongs();
        setAlbums(albumsData);
        setSongs(songsData);
      } catch (err) {
        console.error("Loi khi tai du lieu Home:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      {/* Banner bắt đầu */}
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

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Album nổi bật</h1>
        <div className="flex overflow-auto">
          {albums.map((item) => (
            <AlbumItem
              key={item.id}
              id={item.id}
              name={item.title}
              desc={item.artist?.name}
              image={item.coverUrl}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Bài hát thịnh hành</h1>
        <div className="flex overflow-auto">
          {songs.map((item) => (
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
    </>
  );
};

export default Home;