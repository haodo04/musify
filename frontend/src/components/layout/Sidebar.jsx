import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getMyPlaylists } from "../../services/playlistService";
import { getAllArtists } from "../../services/artistService";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState("playlists"); // "playlists" | "artists"
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      getMyPlaylists().then(setPlaylists).catch(() => {});
    }
    getAllArtists().then(setArtists).catch(() => {});
  }, [isAuthenticated]);

  const handleLibraryClick = () => {
    if (isAuthenticated) navigate("/library");
    else navigate("/login");
  };

  const filteredPlaylists = playlists.filter((pl) =>
    pl.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] rounded flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <p onClick={handleLibraryClick} className="font-bold text-lg cursor-pointer hover:text-white">
            Thư viện của bạn
          </p>
          <button
            onClick={() => (isAuthenticated ? navigate("/library") : navigate("/login"))}
            className="flex items-center gap-1 text-sm font-semibold text-[#a7a7a7] hover:text-white px-2 py-1 rounded-full hover:bg-[#242424] transition"
          >
            <span className="text-lg leading-none">+</span> Tạo
          </button>
        </div>

        {/* Tab lọc */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setFilter("playlists")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
              filter === "playlists" ? "bg-[#333]" : "bg-[#1a1a1a] hover:bg-[#242424]"
            }`}
          >
            Playlist
          </button>
          <button
            onClick={() => setFilter("artists")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
              filter === "artists" ? "bg-[#333]" : "bg-[#1a1a1a] hover:bg-[#242424]"
            }`}
          >
            Nghệ sĩ
          </button>
        </div>

        {/* Thanh search + sort */}
        <div className="px-4 pb-2 flex items-center justify-between">
          {showSearch ? (
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => !search && setShowSearch(false)}
              placeholder="Tìm trong thư viện"
              className="w-full bg-[#2a2a2a] text-sm rounded-full px-4 py-1.5 outline-none placeholder:text-[#a7a7a7]"
            />
          ) : (
            <>
              <Search
                onClick={() => setShowSearch(true)}
                className="w-4 h-4 text-[#a7a7a7] hover:text-white cursor-pointer"
              />
              <div className="flex items-center gap-1 text-sm text-[#a7a7a7] hover:text-white cursor-pointer">
                Gần đây <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
            </>
          )}
        </div>

        {/* Danh sách */}
        <div className="flex-1 overflow-auto px-2">
          {filter === "playlists" ? (
            !isAuthenticated ? (
              <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start gap-1">
                <h1 className="text-sm">Đăng nhập để xem thư viện</h1>
                <p className="font-light text-xs text-[#a7a7a7]">Lưu playlist và bài hát yêu thích</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-3"
                >
                  Đăng nhập
                </button>
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start gap-1">
                <h1 className="text-sm">Tạo playlist đầu tiên của bạn</h1>
                <p className="font-light text-xs text-[#a7a7a7]">Rất dễ, chúng tôi sẽ giúp bạn</p>
                <button
                  onClick={() => navigate("/library")}
                  className="px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-3"
                >
                  Tạo playlist
                </button>
              </div>
            ) : (
              filteredPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-[#242424] cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#333] rounded flex items-center justify-center text-xl shrink-0">
                    🎵
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{pl.name}</p>
                    <p className="text-xs text-[#a7a7a7]">Playlist</p>
                  </div>
                </div>
              ))
            )
          ) : filteredArtists.length === 0 ? (
            <p className="text-sm text-[#a7a7a7] p-4">Không có nghệ sĩ nào</p>
          ) : (
            filteredArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-[#242424] cursor-pointer"
              >
                {artist.avatarUrl ? (
                  <img src={artist.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center text-xl shrink-0">
                    🎤
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{artist.name}</p>
                  <p className="text-xs text-[#a7a7a7]">Nghệ sĩ</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;