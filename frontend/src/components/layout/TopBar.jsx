import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, Users, Download } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AppLogo from "../icons/AppLogo";

const TopBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search?q=${encodeURIComponent(keyword)}`);
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

      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="flex items-center bg-[#242424] hover:bg-[#2a2a2a] rounded-full px-4 py-2.5 gap-3">
          <Search className="w-5 h-5 text-white shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Bạn muốn nghe gì?"
            className="bg-transparent outline-none text-white placeholder:text-[#a7a7a7] w-full text-sm"
          />
        </div>
      </form>

      <div className="flex items-center gap-4 shrink-0">
        {isAuthenticated ? (
          <>
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#a7a7a7] hover:text-white transition">
              <Download className="w-5 h-5" /> Cài đặt ứng dụng
            </button>
            <Bell className="w-5 h-5 text-[#a7a7a7] hover:text-white cursor-pointer hidden md:block" />
            <Users className="w-5 h-5 text-[#a7a7a7] hover:text-white cursor-pointer hidden md:block" />
            <div className="relative">
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold text-sm"
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#282828] rounded shadow-lg py-1 z-50">
                  <p className="px-4 py-2 text-sm text-[#a7a7a7] truncate">
                    {user?.username}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#3e3e3e]"
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
