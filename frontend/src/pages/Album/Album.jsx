import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { getAlbumById } from "../../services/albumService";
import { getSongsByAlbum } from "../../services/songService";

const Album = () => {
  const { id } = useParams();
  const { playWithId } = useContext(PlayerContext);
  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const album = await getAlbumById(id);
        const albumSongs = await getSongsByAlbum(id);
        setAlbumData(album);
        setSongs(albumSongs);
      } catch (err) {
        console.error("Loi khi tai album:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!albumData) return <div className="text-white p-4">Đang tải...</div>;

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={albumData.coverUrl} alt="" />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.title}</h2>
          <h4>{albumData.artist?.name}</h4>
          <p className="mt-1">
            <img className="inline-block w-5" src={assets.spotify_logo} alt="" />
            <b> Spotify </b>•{" "}
            <b>{songs.length} songs</b>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Title</p>
        <p>Album</p>
        <p className="hidden sm:block">Genre</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {songs.map((item, index) => (
        <div
          onClick={() => playWithId(item.id)}
          key={item.id}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
        >
          <div className="text-white text-sm md:text-[15px]">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img className="inline w-10 mb-5 mr-5" src={item.imageUrl} alt={item.title} />
            <div className="inline-block">
              <div>{item.title?.slice(0, 20)}</div>
              <div className="text-[#a7a7a7]">{item.artist?.name}</div>
            </div>
          </div>
          <p className="text-[15px]">{albumData.title}</p>
          <p className="text-[15px] hidden sm:block">{item.genre}</p>
          <p className="text-[15px] text-center">{item.duration}s</p>
        </div>
      ))}
    </div>
  );
};

export default Album;