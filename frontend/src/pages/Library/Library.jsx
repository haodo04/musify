import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import PlaylistItem from "../../components/cards/PlaylistItem";
import { FavoriteContext } from "../../context/FavoriteContext";
import { getMyPlaylists, createPlaylist, deletePlaylist } from "../../services/playlistService";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

const toastStyle = { style: { background: "#282828", color: "#fff" } };

const Library = () => {
  const navigate = useNavigate();
  const { favoriteIds } = useContext(FavoriteContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const data = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("Loi khi tai playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createPlaylist({ name, description, isPublic: true });
      setName("");
      setDescription("");
      setShowModal(false);
      fetchPlaylists();
    } catch (err) {
      setError("Không thể tạo playlist, thử lại sau");
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setDeleting(true);
      await deletePlaylist(confirmDeleteId);
      setPlaylists((prev) => prev.filter((pl) => pl.id !== confirmDeleteId));
      toast.success("Đã xoá playlist!", toastStyle);
      window.dispatchEvent(new Event("playlistUpdated"));
    } catch (err) {
      toast.error("Không thể xoá playlist, thử lại sau", toastStyle);
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const playlistToDelete = playlists.find((pl) => pl.id === confirmDeleteId);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between mt-6 mb-6">
        <h1 className="font-bold text-2xl">Thư viện của bạn</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
        >
          + Tạo playlist
        </button>
      </div>

      {loading ? (
        <p className="text-[#a7a7a7]">Đang tải...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          <div
            onClick={() => navigate("/favorites")}
            className="min-w-[160px] max-w-[160px] sm:min-w-[180px] sm:max-w-[180px] p-3.5 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-all duration-300 group"
          >
            <div className="w-full aspect-square mb-3 rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
            <p className="font-bold text-[15px] text-white truncate mb-1">Bài hát đã thích</p>
            <p className="text-[13px] text-[#a7a7a7] line-clamp-2 leading-tight">{favoriteIds.size} bài hát</p>
          </div>

          {playlists.length === 0 ? (
            <div className="bg-[#242424] p-6 rounded flex flex-col items-start gap-2 w-full">
              <h2 className="font-bold text-lg">Tạo playlist đầu tiên của bạn</h2>
              <p className="text-[#a7a7a7]">Rất dễ, chúng tôi sẽ giúp bạn</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold mt-2"
              >
                Tạo playlist
              </button>
            </div>
          ) : (
            playlists.map((pl) => {
              const firstSongImage = pl.songs && pl.songs.length > 0 ? pl.songs[0].imageUrl : null;
              return (
                <PlaylistItem
                  key={pl.id}
                  id={pl.id}
                  name={pl.name}
                  description={pl.description}
                  image={firstSongImage}
                  onDelete={setConfirmDeleteId}
                />
              );
            })
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form
            onSubmit={handleCreate}
            className="bg-[#282828] p-6 rounded-lg w-96 flex flex-col gap-3"
          >
            <h2 className="font-bold text-xl mb-2">Tạo playlist mới</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="text"
              placeholder="Tên playlist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#3e3e3e] p-2.5 rounded outline-none"
              required
            />
            <textarea
              placeholder="Mô tả (tùy chọn)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#3e3e3e] p-2.5 rounded outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-[#727272] rounded-full py-2 font-bold hover:border-white transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black rounded-full py-2 font-bold disabled:opacity-50"
              >
                {creating ? "Đang tạo..." : "Tạo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg w-96 flex flex-col gap-3">
            <h2 className="font-bold text-xl mb-1">Xoá playlist?</h2>
            <p className="text-[#a7a7a7] text-sm">
              Bạn có chắc muốn xoá playlist "{playlistToDelete?.name}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-[#727272] rounded-full py-2 font-bold hover:border-white transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-full py-2 font-bold disabled:opacity-50"
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Library;