import { useEffect, useState } from "react";
import { X, ListMusic, Check, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getMyPlaylists, addSongToPlaylist, createPlaylist } from "../../services/playlistService";

const toastStyle = { style: { background: "#282828", color: "#fff" } };

const AddToPlaylistModal = ({ songId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getMyPlaylists();
      setPlaylists(data || []);
    } catch (err) {
      console.error("Lỗi khi tải playlist:", err);
      toast.error("Không thể tải danh sách playlist", toastStyle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleAdd = async (playlistId) => {
    if (!songId) return;
    try {
      setAddingId(playlistId);
      await addSongToPlaylist(playlistId, songId);
      setAddedIds((prev) => [...prev, playlistId]);
      toast.success("Đã thêm vào playlist!", toastStyle);
      window.dispatchEvent(new Event("playlistUpdated"));
    } catch (err) {
      toast.error("Bài hát đã có trong playlist hoặc có lỗi xảy ra", toastStyle);
    } finally {
      setAddingId(null);
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setCreating(true);
      const newPlaylist = await createPlaylist({ name: newName.trim(), description: "", isPublic: true });
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setNewName("");
      if (newPlaylist?.id) {
        await handleAdd(newPlaylist.id);
      }
    } catch (err) {
      toast.error("Không thể tạo playlist mới", toastStyle);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#282828] text-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3e3e3e]">
          <h3 className="font-bold text-base">Thêm vào playlist</h3>
          <button onClick={onClose} className="text-[#a7a7a7] hover:text-white p-1 rounded-full hover:bg-[#3e3e3e] transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreateAndAdd} className="flex gap-2 px-5 py-3 border-b border-[#3e3e3e]">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tạo playlist mới..."
            className="flex-1 bg-[#3e3e3e] rounded px-3 py-2 text-sm outline-none placeholder:text-[#a7a7a7]"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="bg-white text-black rounded-full p-2 disabled:opacity-40 hover:scale-105 transition shrink-0"
            title="Tạo và thêm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="max-h-72 overflow-y-auto custom-scrollbar py-2">
          {loading ? (
            <p className="px-5 py-4 text-sm text-[#a7a7a7]">Đang tải playlist...</p>
          ) : playlists.length === 0 ? (
            <p className="px-5 py-4 text-sm text-[#a7a7a7]">Bạn chưa có playlist nào, hãy tạo một cái ở trên.</p>
          ) : (
            playlists.map((pl) => {
              const isAdded = addedIds.includes(pl.id);
              return (
                <button
                  key={pl.id}
                  onClick={() => !isAdded && handleAdd(pl.id)}
                  disabled={addingId === pl.id || isAdded}
                  className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#3e3e3e] transition text-left disabled:cursor-default"
                >
                  <div className="w-9 h-9 rounded bg-[#3e3e3e] flex items-center justify-center shrink-0">
                    <ListMusic className="w-4 h-4 text-[#a7a7a7]" />
                  </div>
                  <span className="flex-1 text-sm font-medium truncate">{pl.name}</span>
                  {isAdded ? (
                    <Check className="w-4 h-4 text-[#1db954] shrink-0" />
                  ) : addingId === pl.id ? (
                    <span className="text-xs text-[#a7a7a7] shrink-0">Đang thêm...</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;