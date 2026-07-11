import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import AlbumItem from "../../components/cards/AlbumItem";
import SongItem from "../../components/cards/SongItem";
import { getAllAlbums } from "../../services/albumService";
import { getAllSongs } from "../../services/songService";

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

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
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
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
        <h1 className="my-5 font-bold text-2xl">Today&apos;s biggest hits</h1>
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