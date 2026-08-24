import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ArrowRight, List, Music, Folder, Disc3, Globe, Home, Library, Trash2, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getMyPlaylists, createPlaylist, deletePlaylist } from "../../services/playlistService";
import { getAllArtists } from "../../services/artistService";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState("playlists");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); 
  const [newPlaylistName, setNewPlaylistName] = useState("");
  
  const dropdownRef = useRef(null);

  const fetchPlaylists = () => {
    if (isAuthenticated) {
      getMyPlaylists().then(setPlaylists).catch(() => {});
    }
  };

  useEffect(() => {
    fetchPlaylists();
    setShowTooltip(false);
    getAllArtists().then(setArtists).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    const handlePlaylistUpdate = () => fetchPlaylists();
    window.addEventListener("playlistUpdated", handlePlaylistUpdate);
    return () => window.removeEventListener("playlistUpdated", handlePlaylistUpdate);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateClick = (e) => {
    if (isAuthenticated) {
      setIsCreateOpen(!isCreateOpen);
    } else {
      e.stopPropagation();
      setShowTooltip(true);
    }
  };

  const handleCreateNewPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist({ name: newPlaylistName, description: "" });
      setIsCreateModalOpen(false);
      setNewPlaylistName("");
      fetchPlaylists();
      toast.success("Đã tạo danh sách phát mới!", { style: { background: '#282828', color: '#fff' } });
    } catch (error) {
      toast.error("Lỗi khi tạo playlist", { style: { background: '#282828', color: '#fff' } });
    }
  };

  const confirmDeletePlaylist = async () => {
    if (!deleteConfirmId) return;
    try {
      await deletePlaylist(deleteConfirmId);
      fetchPlaylists();
      toast.success("Đã xóa danh sách phát!", { style: { background: '#282828', color: '#fff' } });
      if (window.location.pathname === `/playlist/${deleteConfirmId}`) navigate("/");
    } catch (error) {
      toast.error("Xóa thất bại!", { style: { background: '#282828', color: '#fff' } });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const filteredPlaylists = playlists.filter((pl) => pl.name.toLowerCase().includes(search.toLowerCase()));
  const filteredArtists = artists.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-[320px] h-full flex flex-col gap-2 p-2 hidden lg:flex relative z-40">
      
      <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-5">
        <div onClick={() => navigate("/")} className="flex items-center gap-4 text-[#a7a7a7] hover:text-white cursor-pointer transition font-bold">
          <Home className="w-6 h-6" />
          <span className="text-[15px]">Trang chủ</span>
        </div>
        <div onClick={() => navigate("/search")} className="flex items-center gap-4 text-[#a7a7a7] hover:text-white cursor-pointer transition font-bold">
          <Search className="w-6 h-6" />
          <span className="text-[15px]">Tìm kiếm</span>
        </div>
      </div>

      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col relative">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between shadow-sm z-10">
          <div onClick={() => isAuthenticated ? navigate("/library") : navigate("/login")} className="flex items-center gap-3 text-[#a7a7a7] hover:text-white cursor-pointer transition font-bold group">
            <Library className="w-6 h-6 group-hover:text-white transition" />
            <span className="text-[15px]">Thư viện của bạn</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="relative" ref={dropdownRef}>
              <button onClick={handleCreateClick} className="flex items-center gap-1.5 px-3 py-1.5 text-[#a7a7a7] hover:text-white hover:bg-[#1a1a1a] rounded-full transition" title="Tạo">
                <Plus className="w-5 h-5" />
                <span className="text-[14px] font-bold">Tạo</span>
              </button>
              
              {isCreateOpen && isAuthenticated && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-[#282828] rounded-md shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)] z-[999] py-1 border border-[#3e3e3e] animate-fadeIn">
                  <div onClick={() => {setIsCreateOpen(false); setIsCreateModalOpen(true);}} className="flex items-center gap-3 px-4 py-3 hover:bg-[#3e3e3e] cursor-pointer transition">
                    <Music className="w-5 h-5 text-[#a7a7a7]" />
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium mb-0.5">Playlist</p>
                      <p className="text-[11px] text-[#a7a7a7]">Tạo danh sách phát gồm các bài hát hoặc podcast</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="p-1.5 text-[#a7a7a7] hover:text-white hover:bg-[#1a1a1a] rounded-full transition"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            <div className="px-5 py-2 flex gap-2">
              <button onClick={() => setFilter("playlists")} className={`text-[13px] font-medium px-3 py-1.5 rounded-full transition ${filter === "playlists" ? "bg-white text-black" : "bg-[#242424] hover:bg-[#2a2a2a] text-white"}`}>Playlist</button>
              <button onClick={() => setFilter("artists")} className={`text-[13px] font-medium px-3 py-1.5 rounded-full transition ${filter === "artists" ? "bg-white text-black" : "bg-[#242424] hover:bg-[#2a2a2a] text-white"}`}>Nghệ sĩ</button>
            </div>

            <div className="px-5 pt-1 pb-2 flex items-center justify-between text-[#a7a7a7]">
              {showSearch ? (
                <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => !search && setShowSearch(false)} placeholder="Tìm trong thư viện" className="w-full bg-[#2a2a2a] text-[13px] rounded-md px-3 py-1.5 outline-none text-white placeholder:text-[#a7a7a7] transition-all" />
              ) : (
                <>
                  <button onClick={() => setShowSearch(true)} className="p-1.5 hover:bg-[#242424] hover:text-white rounded-full transition"><Search className="w-4 h-4" /></button>
                  <button className="flex items-center gap-1.5 hover:text-white hover:scale-105 transition text-[13px] font-medium">Gần đây <List className="w-4 h-4" /></button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2">
              {filter === "playlists" ? (
                filteredPlaylists.map((pl) => {
                  const firstSongImage = pl.songs && pl.songs.length > 0 ? pl.songs[0].imageUrl : null;
                  return (
                    <div key={pl.id} onClick={() => navigate(`/playlist/${pl.id}`)} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition group relative">
                      {firstSongImage ? (
                        <img src={firstSongImage} alt={pl.name} className="w-12 h-12 object-cover rounded shadow-md shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center shrink-0 shadow-md"><Music className="w-5 h-5 text-[#a7a7a7]" /></div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1 pr-8">
                        <p className="text-white font-medium truncate text-[15px] group-hover:text-white text-[#e5e5e5]">{pl.name}</p>
                        <p className="text-[#a7a7a7] text-[13px] truncate">Playlist • {user?.username}</p>
                      </div>
                    
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(pl.id); }}
                        className="absolute right-3 opacity-0 group-hover:opacity-100 p-2 text-[#a7a7a7] hover:text-white hover:bg-[#333] rounded-full transition-all"
                        title="Xóa Playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                filteredArtists.map((artist) => (
                  <div key={artist.id} onClick={() => navigate(`/artist/${artist.id}`)} className="flex items-center gap-3 p-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition group">
                    {artist.avatarUrl ? (
                      <img src={artist.avatarUrl} alt={artist.name} className="w-12 h-12 object-cover rounded-full shrink-0 shadow-md" />
                    ) : (
                      <div className="w-12 h-12 bg-[#282828] rounded-full flex items-center justify-center text-xl shrink-0 shadow-md">🎤</div>
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-white font-medium truncate text-[15px] group-hover:text-white text-[#e5e5e5]">{artist.name}</p>
                      <p className="text-[#a7a7a7] text-[13px] truncate">Nghệ sĩ</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col flex-1 px-2"></div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#282828] w-full max-w-md rounded-xl shadow-2xl p-6 relative animate-fadeIn border border-[#3e3e3e]">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-[#a7a7a7] hover:text-white transition bg-[#121212] rounded-full p-1"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-white mb-6">Tạo danh sách phát mới</h2>
            <input type="text" autoFocus value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateNewPlaylist()} placeholder="Nhập tên danh sách phát..." className="w-full bg-[#3e3e3e] text-white px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#1db954] transition mb-6 placeholder:text-[#a7a7a7]" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 text-white font-bold hover:scale-105 transition">Hủy</button>
              <button onClick={handleCreateNewPlaylist} disabled={!newPlaylistName.trim()} className="px-5 py-2 bg-[#1db954] text-black font-bold rounded-full hover:scale-105 transition disabled:opacity-50">Tạo mới</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#282828] w-full max-w-sm rounded-xl shadow-2xl p-6 relative animate-fadeIn border border-[#3e3e3e]">
            <h2 className="text-lg font-bold text-white mb-2">Xóa khỏi Thư viện?</h2>
            <p className="text-sm text-[#a7a7a7] mb-6 leading-relaxed">Điều này sẽ xóa danh sách phát khỏi Thư viện của bạn. Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2 text-white font-bold hover:scale-105 transition">Hủy</button>
              <button onClick={confirmDeletePlaylist} className="px-6 py-2 bg-[#f15e6c] text-white font-bold rounded-full hover:scale-105 transition hover:bg-red-500">Xóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;