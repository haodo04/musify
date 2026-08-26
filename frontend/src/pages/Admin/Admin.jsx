import { useEffect, useState, useContext } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { PlayerContext } from "../../context/PlayerContext";
import { AuthContext } from "../../context/AuthContext";
import { getAllArtists, getAllAlbums, getAllSongs, deleteSong, deleteAlbum, deleteArtist } from "../../services/adminService";
import { getAllUsersAdmin, updateUserRole } from "../../services/adminUserService";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Toast from "./components/Toast";
import Modal from "./components/Modal";

import DashboardView from "./views/DashboardView";
import SongsTable from "./views/SongsTable";
import AlbumsTable from "./views/AlbumsTable";
import ArtistsTable from "./views/ArtistsTable";
import UsersTable from "./views/UsersTable";
import ArtistForm from "./forms/ArtistForm";
import AlbumForm from "./forms/AlbumForm";
import SongForm from "./forms/SongForm";

const DELETE_LABELS = {
  song: { title: "bài hát", field: "title" },
  album: { title: "album", field: "title" },
  artist: { title: "nghệ sĩ", field: "name" },
};

export default function Admin() {
  const { playWithId } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [artData, albData, songData, userData] = await Promise.all([
        getAllArtists().catch(() => []),
        getAllAlbums().catch(() => []),
        getAllSongs().catch(() => []),
        getAllUsersAdmin().catch(() => []),
      ]);
      setArtists(artData);
      setAlbums(albData);
      setSongs(songData);
      setUsers(userData);
    } catch (err) {
      showToast("Không thể tải dữ liệu hệ thống", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    try {
      setDeleting(true);
      if (type === "song") {
        await deleteSong(item.id);
        setSongs((prev) => prev.filter((s) => s.id !== item.id));
      } else if (type === "album") {
        await deleteAlbum(item.id);
        setAlbums((prev) => prev.filter((a) => a.id !== item.id));
      } else if (type === "artist") {
        await deleteArtist(item.id);
        setArtists((prev) => prev.filter((a) => a.id !== item.id));
      }
      showToast(`Đã xoá ${DELETE_LABELS[type].title}!`);
    } catch (err) {
      const msg = err?.response?.data?.message || `Không thể xoá ${DELETE_LABELS[type].title} này`;
      showToast(msg, "err");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      showToast(newRole === "ADMIN" ? "Đã phong Admin!" : "Đã hạ xuống User!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Không thể đổi quyền người dùng này";
      showToast(msg, "err");
    }
  };

  const filteredSongs = songs.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAlbums = albums.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredArtists = artists.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPlays = songs.reduce((sum, song) => sum + (song.playCount || 0), 0);

  return (
    <div className="flex h-screen bg-[#090909] text-white font-sans overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        songsCount={songs.length}
        albumsCount={albums.length}
        artistsCount={artists.length}
        usersCount={users.length}
        loading={loading}
        loadData={loadData}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setModalOpen={setModalOpen}
        />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-[#a7a7a7]">
              <Loader2 className="w-8 h-8 animate-spin text-[#1db954]" />
              <p className="text-sm font-medium">Đang kết nối hệ thống Musify...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardView
                  songs={songs}
                  albums={albums}
                  artists={artists}
                  users={users}
                  totalPlays={totalPlays}
                  setActiveTab={setActiveTab}
                  setModalOpen={setModalOpen}
                  playWithId={playWithId}
                />
              )}
              {activeTab === "songs" && (
                <SongsTable
                  filteredSongs={filteredSongs}
                  playWithId={playWithId}
                  onDeleteRequest={(song) => setDeleteTarget({ type: "song", item: song })}
                  onEditRequest={(song) => setEditTarget({ type: "song", item: song })}
                />
              )}
              {activeTab === "albums" && (
                <AlbumsTable
                  filteredAlbums={filteredAlbums}
                  onDeleteRequest={(album) => setDeleteTarget({ type: "album", item: album })}
                  onEditRequest={(album) => setEditTarget({ type: "album", item: album })}
                />
              )}
              {activeTab === "artists" && (
                <ArtistsTable
                  filteredArtists={filteredArtists}
                  onDeleteRequest={(artist) => setDeleteTarget({ type: "artist", item: artist })}
                  onEditRequest={(artist) => setEditTarget({ type: "artist", item: artist })}
                />
              )}
              {activeTab === "users" && (
                <UsersTable
                  filteredUsers={filteredUsers}
                  currentUserEmail={user?.email}
                  onRoleChange={handleRoleChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Thêm ${activeTab === "artists" ? "Nghệ sĩ" : activeTab === "albums" ? "Album" : "Bài hát mới"}`}>
        {activeTab === "artists" && <ArtistForm onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
        {activeTab === "albums" && <AlbumForm artists={artists} onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
        {activeTab === "songs" && <SongForm artists={artists} albums={albums} onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title={`Sửa ${editTarget ? DELETE_LABELS[editTarget.type].title : ""}`}>
        {editTarget?.type === "artist" && (
          <ArtistForm artist={editTarget.item} onSuccess={(msg) => { showToast(msg); setEditTarget(null); loadData(); }} />
        )}
        {editTarget?.type === "album" && (
          <AlbumForm artists={artists} album={editTarget.item} onSuccess={(msg) => { showToast(msg); setEditTarget(null); loadData(); }} />
        )}
        {editTarget?.type === "song" && (
          <SongForm artists={artists} albums={albums} song={editTarget.item} onSuccess={(msg) => { showToast(msg); setEditTarget(null); loadData(); }} />
        )}
      </Modal>

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#282828] rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2 capitalize">Xoá {DELETE_LABELS[deleteTarget.type].title}?</h3>
            <p className="text-sm text-[#a7a7a7] mb-6">
              Bạn có chắc muốn xoá "<span className="text-white font-medium">{deleteTarget.item[DELETE_LABELS[deleteTarget.type].field]}</span>"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-[#3e3e3e] hover:border-white text-white font-bold py-2.5 rounded-xl transition"
              >
                Huỷ
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50"
              >
                {deleting ? "Đang xoá..." : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}