import { useEffect, useState, useContext } from "react";
import { Loader2 } from "lucide-react";
import { PlayerContext } from "../../context/PlayerContext";
import { getAllArtists, getAllAlbums, getAllSongs } from "../../services/adminService";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Toast from "./components/Toast";
import Modal from "./components/Modal";

import DashboardView from "./views/DashboardView";
import SongsTable from "./views/SongsTable";
import AlbumsTable from "./views/AlbumsTable";
import ArtistsTable from "./views/ArtistsTable";
import ArtistForm from "./forms/ArtistForm";
import AlbumForm from "./forms/AlbumForm";
import SongForm from "./forms/SongForm";

export default function Admin() {
  const { playWithId } = useContext(PlayerContext);

  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [artData, albData, songData] = await Promise.all([
        getAllArtists().catch(() => []),
        getAllAlbums().catch(() => []),
        getAllSongs().catch(() => []),
      ]);
      setArtists(artData);
      setAlbums(albData);
      setSongs(songData);
    } catch (err) {
      showToast("Không thể tải dữ liệu hệ thống", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSongs = songs.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAlbums = albums.filter(a => a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.artist?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredArtists = artists.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPlays = songs.reduce((sum, song) => sum + (song.playCount || 0), 0);

  return (
    <div className="flex h-screen bg-[#090909] text-white font-sans overflow-hidden">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        songsCount={songs.length}
        albumsCount={albums.length}
        artistsCount={artists.length}
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
                  totalPlays={totalPlays}
                  setActiveTab={setActiveTab}
                  setModalOpen={setModalOpen}
                  playWithId={playWithId}
                />
              )}
              {activeTab === "songs" && <SongsTable filteredSongs={filteredSongs} playWithId={playWithId} />}
              {activeTab === "albums" && <AlbumsTable filteredAlbums={filteredAlbums} />}
              {activeTab === "artists" && <ArtistsTable filteredArtists={filteredArtists} />}
            </>
          )}
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Thêm ${activeTab === "artists" ? "Nghệ sĩ" : activeTab === "albums" ? "Album" : "Bài hát mới"}`}>
        {activeTab === "artists" && <ArtistForm onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
        {activeTab === "albums" && <AlbumForm artists={artists} onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
        {activeTab === "songs" && <SongForm artists={artists} albums={albums} onSuccess={(msg) => { showToast(msg); setModalOpen(false); loadData(); }} />}
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}