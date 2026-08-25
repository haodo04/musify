import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import {
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../../services/playlistService";
import { getAllSongs } from "../../services/songService";
import { Pause, Trash2, Heart } from "lucide-react";
import toast from "react-hot-toast";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playWithId, track, playStatus } = useContext(PlayerContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);

  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPlaylist = async () => {
    try {
      const data = await getPlaylistById(id);
      setPlaylist(data);
    } catch (err) {
      console.error("Loi khi tai playlist:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
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
      await fetchPlaylist();
      toast.success("Đã thêm bài hát vào danh sách!", { style: { background: '#282828', color: '#fff' } });
      window.dispatchEvent(new Event("playlistUpdated")); 
    } catch (err) {
      toast.error("Bài hát đã có hoặc xảy ra lỗi!", { style: { background: '#282828', color: '#fff' } });
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist(id, songId);
      await fetchPlaylist();
      toast.success("Đã xóa bài hát khỏi danh sách!", { style: { background: '#282828', color: '#fff' } });
      window.dispatchEvent(new Event("playlistUpdated")); // Bắn sự kiện kêu Sidebar update đi!
    } catch (err) {
      toast.error("Lỗi khi xóa bài hát!", { style: { background: '#282828', color: '#fff' } });
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      setDeleting(true);
      await deletePlaylist(id);
      toast.success("Đã xoá playlist!", { style: { background: "#282828", color: "#fff" } });
      window.dispatchEvent(new Event("playlistUpdated"));
      navigate("/library");
    } catch (err) {
      toast.error("Không thể xoá playlist!", { style: { background: "#282828", color: "#fff" } });
      setDeleting(false);
    }
  };

  const handleFavoriteClick = (songId) => {
    toggleFavorite(songId);
  };

  if (loading) return <div className="p-4 text-white">Đang tải...</div>;

  if (notFound || !playlist) {
    return (
      <div className="text-white p-8 flex flex-col items-center text-center gap-3 mt-10">
        <p className="font-bold text-xl">Không tìm thấy playlist này</p>
        <p className="text-[#a7a7a7] text-sm">Playlist có thể đã bị xoá hoặc bạn không có quyền xem.</p>
        <button
          onClick={() => navigate("/library")}
          className="mt-2 bg-white text-black font-bold px-5 py-2 rounded-full hover:scale-105 transition"
        >
          Về thư viện
        </button>
      </div>
    );
  }

  const songsInPlaylist = playlist.songs.map((s) => s.id);
  const songsNotInPlaylist = allSongs.filter((s) => !songsInPlaylist.includes(s.id));
  const firstSongImage = playlist.songs.length > 0 ? playlist.songs[0].imageUrl : null;

  return (
    <div className="bg-[#121212] min-h-screen text-white pb-10">
      <Navbar />
      <div className="mt-10 px-8 flex gap-8 flex-col md:flex-row md:items-end">
        
        <div className="w-48 h-48 bg-[#282828] rounded shadow-2xl flex items-center justify-center text-6xl overflow-hidden shrink-0">
          {firstSongImage ? (
            <img src={firstSongImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            "🎵"
          )}
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm font-bold uppercase mb-2">Playlist</p>
          <h2 className="text-5xl font-black mb-4 md:text-7xl tracking-tighter">{playlist.name}</h2>
          <h4 className="text-[#a7a7a7] font-medium">{playlist.description}</h4>
          <p className="mt-2 text-[#a7a7a7] font-bold text-sm">{playlist.songs.length} bài hát</p>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6 px-8">
        <button
          onClick={handleShowAddPanel}
          className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition"
        >
          {showAddPanel ? "Đóng bảng thêm" : "+ Thêm bài hát"}
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-2 border border-[#727272] hover:border-red-400 hover:text-red-400 text-[#a7a7a7] px-4 py-2 rounded-full font-bold text-sm transition"
        >
          <Trash2 className="w-4 h-4" /> Xoá playlist
        </button>
      </div>

      {showAddPanel && (
        <div className="bg-[#181818] rounded-xl p-4 mb-6 mx-8 max-h-80 overflow-y-auto custom-scrollbar border border-[#282828]">
          <h3 className="font-bold mb-4 text-lg">Gợi ý bài hát</h3>
          {songsNotInPlaylist.length === 0 ? (
            <p className="text-[#a7a7a7] text-sm">Không còn bài hát nào để thêm</p>
          ) : (
            songsNotInPlaylist.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between py-2 hover:bg-[#282828] px-3 rounded-md transition group"
              >
                <div className="flex items-center gap-3">
                  <img src={song.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                  <div>
                    <p className="text-sm font-bold">{song.title}</p>
                    <p className="text-xs text-[#a7a7a7]">{song.artist?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddSong(song.id)}
                  className="text-xs border border-[#a7a7a7] text-white px-4 py-1.5 rounded-full font-bold group-hover:border-white hover:scale-105 transition"
                >
                  Thêm
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="px-8 mt-8">
        <div className="grid grid-cols-[50px_minmax(200px,1fr)_minmax(150px,1fr)_70px_70px] gap-2 mb-4 text-[#a7a7a7] text-sm font-medium border-b border-[#282828] pb-2 px-2">
          <p className="text-center">#</p>
          <p>Tiêu đề</p>
          <p className="hidden md:block">Thể loại</p>
          <p className="text-center">Thời lượng</p>
          <div></div>
        </div>

        {playlist.songs.length === 0 ? (
          <p className="text-[#a7a7a7] mt-6 text-center">Playlist này chưa có bài hát nào, hãy tìm và thêm nhé!</p>
        ) : (
          <div className="flex flex-col gap-1">
            {playlist.songs.map((item, index) => {
              const isActive = track?.id === item.id;
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[50px_minmax(200px,1fr)_minmax(150px,1fr)_70px_70px] gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#282828] rounded-md group transition"
                >
                  <div className="text-center font-medium">
                    {isActive && playStatus ? (
                      <Pause className="w-4 h-4 fill-[#1db954] text-[#1db954] mx-auto" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div 
                    onClick={() => playWithId(item.id, playlist.songs)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img className="w-10 h-10 object-cover rounded shadow-md" src={item.imageUrl} alt={item.title} />
                    <div className="flex flex-col min-w-0">
                      <span className={`font-medium truncate ${isActive ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>{item.title}</span>
                      <span className="text-[13px] truncate">{item.artist?.name}</span>
                    </div>
                  </div>
                  
                  <p className="text-[14px] hidden md:block truncate">{item.genre}</p>

                  <p className="text-[14px] text-center">{item.duration}s</p>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleFavoriteClick(item.id)}
                      title={isFavorite(item.id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
                      className={`transition ${isFavorite(item.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(item.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                    <button
                      onClick={() => handleRemoveSong(item.id)}
                      title="Xoá khỏi playlist"
                      className="opacity-0 group-hover:opacity-100 transition text-white hover:text-red-400 text-xs font-bold bg-black/50 px-1.5 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-96 flex flex-col gap-3">
            <h2 className="font-bold text-xl mb-1">Xoá playlist?</h2>
            <p className="text-[#a7a7a7] text-sm">
              Bạn có chắc muốn xoá playlist "{playlist.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-[#727272] rounded-full py-2 font-bold hover:border-white transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeletePlaylist}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full py-2 font-bold disabled:opacity-50"
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;