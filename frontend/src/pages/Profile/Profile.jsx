import { useContext, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { FollowContext } from "../../context/FollowContext";
import { updateProfile } from "../../services/userService";
import { getMyFavorites } from "../../services/favoriteService";
import { getMyFollowedArtists } from "../../services/followService";
import { getMyPlaylists } from "../../services/playlistService";
import { getAllSongs } from "../../services/songService";
import { getRecentlyPlayedIds } from "../../utils/recentlyPlayed";
import Navbar from "../../components/layout/Navbar";
import SectionHeader from "../../components/layout/SectionHeader";
import SongItem from "../../components/cards/SongItem";
import ArtistItem from "../../components/cards/ArtistItem";
import PlaylistItem from "../../components/cards/PlaylistItem";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { favoriteIds } = useContext(FavoriteContext);
  const { followedIds } = useContext(FollowContext);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  const [allSongs, setAllSongs] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsData, favData, followData, playlistData] = await Promise.all([
          getAllSongs().catch(() => []),
          getMyFavorites().catch(() => []),
          getMyFollowedArtists().catch(() => []),
          getMyPlaylists().catch(() => []),
        ]);
        setAllSongs(songsData);
        setFavoriteSongs(favData);
        setFollowedArtists(followData);
        setPlaylists(playlistData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentlyPlayedSongs = useMemo(() => {
    const ids = getRecentlyPlayedIds();
    return ids.map((id) => allSongs.find((s) => s.id === id)).filter(Boolean);
  }, [allSongs]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      setSavingProfile(true);
      const updatedUser = await updateProfile(username, avatarFile);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (setUser) {
        setUser(updatedUser);
      }

      toast.success("Cập nhật hồ sơ thành công!", { style: { background: "#282828", color: "#fff" } });

      setIsEditing(false);
    } catch (err) {
      toast.error("Cập nhật thất bại!", { style: { background: "#282828", color: "#fff" } });
      setIsEditing(false);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-full text-white pb-10">

      <div className="bg-gradient-to-b from-[#3e3e3e] to-[#121212] px-6 pt-4 pb-6">
        <Navbar />

        <div className="mt-6 flex flex-row items-center gap-5">

          <div
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.5)] group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-[#282828] flex items-center justify-center rounded-full text-white font-bold text-3xl md:text-4xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className="text-xs font-bold uppercase mb-0.5 tracking-wide text-white/70">Hồ sơ</p>

            {isEditing ? (
              <input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/30 text-white text-2xl md:text-4xl font-black rounded-lg px-2 py-1 outline-none border-b border-white mb-2 w-full max-w-md truncate"
              />
            ) : (
              <h1
                onClick={() => setIsEditing(true)}
                className="text-2xl md:text-4xl font-black mb-2 text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity truncate max-w-full"
                title="Nhấn để đổi tên"
              >
                {user?.username}
              </h1>
            )}

            <div className="flex items-center gap-2 text-xs md:text-sm text-white/70 font-medium flex-wrap">
              <span>{playlists.length} playlist</span>
              <span>•</span>
              <span>{favoriteIds.size} bài hát yêu thích</span>
              <span>•</span>
              <span>{followedIds.size} đang theo dõi</span>
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setIsEditing(false); setPreview(user?.avatarUrl); setUsername(user?.username); }} className="px-4 py-1.5 rounded-full font-bold text-white border border-[#727272] hover:border-white transition text-xs">Hủy</button>
                <button onClick={handleSave} disabled={savingProfile} className="px-4 py-1.5 rounded-full font-bold text-black bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 transition disabled:opacity-50 text-xs">
                  {savingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <p className="text-[#a7a7a7] text-sm font-medium">Đang tải...</p>
        ) : (
          <>
            <div className="mb-8">
              <SectionHeader title="Nghe gần đây" />
              {recentlyPlayedSongs.length === 0 ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Bạn chưa nghe bài nào gần đây.</p>
              ) : (
                <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                  {recentlyPlayedSongs.map((item) => (
                    <SongItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.imageUrl} queue={recentlyPlayedSongs} />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <SectionHeader title="Bài hát yêu thích" seeAllPath="/favorites" />
              {favoriteSongs.length === 0 ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Bạn chưa thích bài hát nào.</p>
              ) : (
                <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                  {favoriteSongs.map((item) => (
                    <SongItem key={item.id} id={item.id} name={item.title} desc={item.artist?.name} image={item.imageUrl} queue={favoriteSongs} />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <SectionHeader title="Đang theo dõi" />
              {followedArtists.length === 0 ? (
                <p className="text-[#a7a7a7] text-sm font-medium">Bạn chưa theo dõi nghệ sĩ nào.</p>
              ) : (
                <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                  {followedArtists.map((item) => (
                    <ArtistItem key={item.id} id={item.id} name={item.name} image={item.avatarUrl} />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <SectionHeader title="Playlist của bạn" seeAllPath="/library" />
              {playlists.length === 0 ? (
                <div className="flex flex-col items-start gap-2">
                  <p className="text-[#a7a7a7] text-sm font-medium">Bạn chưa tạo playlist nào.</p>
                  <button
                    onClick={() => navigate("/library")}
                    className="text-sm font-bold text-white bg-[#242424] hover:bg-[#2a2a2a] px-4 py-2 rounded-full transition"
                  >
                    Tạo playlist đầu tiên
                  </button>
                </div>
              ) : (
                <div className="flex overflow-auto custom-scrollbar pb-4 gap-6">
                  {playlists.map((pl) => {
                    const firstSongImage = pl.songs && pl.songs.length > 0 ? pl.songs[0].imageUrl : null;
                    return (
                      <PlaylistItem key={pl.id} id={pl.id} name={pl.name} description={pl.description} image={firstSongImage} />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Profile;