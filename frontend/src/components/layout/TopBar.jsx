import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, Users, ExternalLink, X, Play, Shield } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { searchSongs } from "../../services/songService";
import AppLogo from "../icons/AppLogo";

const TopBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gợi ý tìm kiếm trực tiếp khi gõ, debounce 300ms để tránh gọi API liên tục
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchSongs(keyword.trim());
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lỗi khi gợi ý tìm kiếm:", err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
      setShowSuggestions(false);
    }
  };

  const goToSong = (id) => {
    navigate(`/song/${id}`);
    setShowSuggestions(false);
    setKeyword("");
  };

  const clearSearch = () => {
    setKeyword("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  return (
    <div className="h-16 bg-black flex items-center justify-between px-4 gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <AppLogo className="w-8 h-8" />
        <button
          onClick={() => navigate("/")}
          className="bg-[#242424] hover:bg-[#2a2a2a] w-10 h-10 rounded-full flex items-center justify-center transition"
        >
          <Home className="w-5 h-5 text-white" />
        </button>
      </div>

      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <form onSubmit={handleSearch}>
          <div className="flex items-center bg-[#242424] hover:bg-[#2a2a2a] rounded-full px-4 py-2.5 gap-3">
            <Search className="w-5 h-5 text-white shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => keyword.trim() && setShowSuggestions(true)}
              placeholder="Bạn muốn nghe gì?"
              className="bg-transparent outline-none text-white placeholder:text-[#a7a7a7] w-full text-sm"
            />
            {keyword && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-[#a7a7a7] hover:text-white transition shrink-0"
                title="Xoá"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {showSuggestions && keyword.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#282828] rounded-lg shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)] py-2 z-50 max-h-[420px] overflow-y-auto custom-scrollbar animate-fadeIn">
            <div
              onClick={() => { navigate(`/search?q=${encodeURIComponent(keyword)}`); setShowSuggestions(false); }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#3e3e3e] cursor-pointer transition"
            >
              <Search className="w-4 h-4 text-[#a7a7a7] shrink-0" />
              <p className="text-sm text-white truncate">
                <span className="font-semibold">{keyword}</span>
              </p>
            </div>

            {searching ? (
              <p className="px-4 py-3 text-sm text-[#a7a7a7]">Đang tìm...</p>
            ) : suggestions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#a7a7a7]">Không tìm thấy bài hát phù hợp</p>
            ) : (
              suggestions.map((song) => (
                <div
                  key={song.id}
                  onClick={() => goToSong(song.id)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#3e3e3e] cursor-pointer transition group"
                >
                  <img
                    src={song.imageUrl || "https://placehold.co/80x80?text=Song"}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">{song.title}</p>
                    <p className="text-xs text-[#a7a7a7] truncate">Bài hát • {song.artist?.name || "Đang cập nhật"}</p>
                  </div>
                  <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition shrink-0" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {isAuthenticated ? (
          <>
            {user?.role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin")}
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-black bg-[#1db954] hover:bg-[#1ed760] px-3.5 py-1.5 rounded-full transition"
                title="Trang quản trị"
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            )}
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#a7a7a7] hover:text-white transition">
              Khám phá Premium
            </button>
            <Bell className="w-5 h-5 text-[#a7a7a7] hover:text-white cursor-pointer hidden md:block" />
            <Users className="w-5 h-5 text-[#a7a7a7] hover:text-white cursor-pointer hidden md:block" />
            
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold text-sm hover:scale-105 transition"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#282828] rounded-md shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)] py-1 z-50 text-sm font-medium text-[#e5e5e5]">
                  {user?.role === "ADMIN" && (
                    <>
                      <button
                        onClick={() => { setShowMenu(false); navigate("/admin"); }}
                        className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex items-center gap-2 text-[#1db954] font-bold transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Trang quản trị
                      </button>
                      <div className="h-px bg-[#3e3e3e] my-1 mx-1" />
                    </>
                  )}
                  <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex justify-between items-center transition-colors">
                    Tài khoản
                    <ExternalLink className="w-4 h-4 text-[#a7a7a7]" />
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); navigate("/profile"); }}
                    className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition-colors"
                  >
                    Hồ sơ
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition-colors">
                    Gần đây
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex justify-between items-center transition-colors">
                    Nâng cấp lên Premium
                    <ExternalLink className="w-4 h-4 text-[#a7a7a7]" />
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] flex justify-between items-center transition-colors">
                    Hỗ trợ
                    <ExternalLink className="w-4 h-4 text-[#a7a7a7]" />
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition-colors">
                    Cài đặt
                  </button>
                  
                  <div className="h-px bg-[#3e3e3e] my-1 mx-1" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-[#3e3e3e] transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="hidden md:block text-sm font-semibold text-[#a7a7a7] hover:text-white cursor-pointer transition">
              Khám phá Premium
            </p>
            <p
              onClick={() => navigate("/register")}
              className="text-sm font-semibold text-[#a7a7a7] hover:text-white cursor-pointer transition"
            >
              Đăng ký
            </p>
            <p
              onClick={() => navigate("/login")}
              className="bg-white text-black text-sm font-bold px-6 py-2 rounded-full cursor-pointer hover:scale-105 transition"
            >
              Đăng nhập
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;