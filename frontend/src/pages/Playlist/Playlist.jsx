import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { PlayerContext } from "../../context/PlayerContext";
import {
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../../services/playlistService";
import { getAllSongs } from "../../services/songService";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithId } = useContext(PlayerContext);

  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data);
    } catch (err) {
      console.error("Loi khi tai playlist:", err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleShowAddPanel = async () => {
    if (allSongs.length === 0) {
      const songs = await getAllSongs();
      setAllSongs(songs);
    }
    setShowAddPanel(!showAddPanel);
  };

  const handleAddSong = async (songId) => {
    try {
      await addSongToPlaylist(id, songId);
      fetchPlaylist();
    } catch (err) {
      alert("Bài hát đã có trong playlist hoặc có lỗi xảy ra");
    }
  };

  const handleRemoveSong = async (songId) => {
    await removeSongFromPlaylist(id, songId);
    fetchPlaylist();
  };

  if (!playlist) return <div className="p-4">Đang tải...</div>;

  const songsInPlaylist = playlist.songs.map((s) => s.id);
  const songsNotInPlaylist = allSongs.filter((s) => !songsInPlaylist.includes(s.id));

  return (
    <div>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <div className="w-48 h-48 bg-[#333] rounded flex items-center justify-center text-6xl">
          🎵
        </div>
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{playlist.name}</h2>
          <h4 className="text-[#a7a7a7]">{playlist.description}</h4>
          <p className="mt-1 text-[#a7a7a7]">{playlist.songs.length} bài hát</p>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <button
          onClick={handleShowAddPanel}
          className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition"
        >
          {showAddPanel ? "Đóng" : "+ Thêm bài hát"}
        </button>
      </div>

      {showAddPanel && (
        <div className="bg-[#181818] rounded p-4 mb-6 max-h-64 overflow-auto">
          <h3 className="font-bold mb-2">Chọn bài hát để thêm</h3>
          {songsNotInPlaylist.length === 0 ? (
            <p className="text-[#a7a7a7] text-sm">Không còn bài hát nào để thêm</p>
          ) : (
            songsNotInPlaylist.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between py-2 hover:bg-[#282828] px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <img src={song.imageUrl} alt="" className="w-10 h-10 rounded" />
                  <div>
                    <p className="text-sm">{song.title}</p>
                    <p className="text-xs text-[#a7a7a7]">{song.artist?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddSong(song.id)}
                  className="text-sm bg-green-500 text-black px-3 py-1 rounded-full font-bold"
                >
                  Thêm
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-4 mb-4 pl-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Tên bài hát</p>
        <p>Nghệ sĩ</p>
        <p className="hidden sm:block">Thể loại</p>
        <p className="text-center">Thời lượng</p>
      </div>
      <hr className="border-[#242424]" />

      {playlist.songs.length === 0 ? (
        <p className="text-[#a7a7a7] mt-6">Playlist này chưa có bài hát nào, thêm ngay!</p>
      ) : (
        playlist.songs.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] rounded group"
          >
            <div
              onClick={() => playWithId(item.id)}
              className="text-white text-sm md:text-[15px] cursor-pointer flex items-center"
            >
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-4" src={item.imageUrl} alt={item.title} />
              <span>{item.title}</span>
            </div>
            <p className="text-[15px]">{item.artist?.name}</p>
            <p className="text-[15px] hidden sm:block">{item.genre}</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-[15px]">{item.duration}s</p>
              <button
                onClick={() => handleRemoveSong(item.id)}
                className="opacity-0 group-hover:opacity-100 transition text-red-400 text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Playlist;