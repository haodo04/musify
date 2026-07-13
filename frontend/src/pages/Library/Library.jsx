import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import PlaylistItem from "../../components/cards/PlaylistItem";
import { getMyPlaylists, createPlaylist } from "../../services/playlistService";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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
      await createPlaylist(name, description, true);
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
      ) : playlists.length === 0 ? (
        <div className="bg-[#242424] p-6 rounded flex flex-col items-start gap-2">
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
        <div className="flex flex-wrap gap-4">
          {playlists.map((pl) => (
            <PlaylistItem key={pl.id} id={pl.id} name={pl.name} description={pl.description} />
          ))}
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
    </>
  );
};

export default Library;