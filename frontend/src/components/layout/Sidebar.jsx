import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, Globe } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getMyPlaylists } from "../../services/playlistService";
import { getAllArtists } from "../../services/artistService";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [filter, setFilter] = useState("playlists");
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getMyPlaylists().then(setPlaylists).catch(() => {});
      setShowTooltip(false); 
    }
    getAllArtists().then(setArtists).catch(() => {});
  }, [isAuthenticated]);

  const handleLibraryClick = () => {
    if (isAuthenticated) navigate("/library");
    else navigate("/login");
  };

  const handleCreateClick = (e) => {
    if (isAuthenticated) {
      navigate("/library");
    } else {
      e.stopPropagation();
      setShowTooltip(true);
    }
  };

  const filteredPlaylists = playlists.filter((pl) =>
    pl.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex relative">
      <div className="bg-[#121212] rounded-lg flex flex-col h-full overflow-hidden">
        <div className="p-4 flex items-center justify-between shadow-sm relative">
          <p onClick={handleLibraryClick} className="font-bold text-[16px] text-[#a7a7a7] cursor-pointer hover:text-white transition">
            Thư viện của bạn
          </p>
          <button
            onClick={handleCreateClick}
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#a7a7a7] hover:text-white hover:bg-[#1a1a1a] transition"
          >
            <span className="text-xl leading-none pb-0.5">+</span>
          </button>
        </div>

        {isAuthenticated ? (
          <>
            <div className="px-4 pb-3 flex gap-2">
              <button onClick={() => setFilter("playlists")} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${filter === "playlists" ? "bg-[#333] text-white" : "bg-[#242424] text-white hover:bg-[#2a2a2a]"}`}>
                Playlist
              </button>
              <button onClick={() => setFilter("artists")} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${filter === "artists" ? "bg-[#333] text-white" : "bg-[#242424] text-white hover:bg-[#2a2a2a]"}`}>
                Nghệ sĩ
              </button>
            </div>

            <div className="px-4 pb-2 flex items-center justify-between">
              {showSearch ? (
                <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={() => !search && setShowSearch(false)} placeholder="Tìm trong thư viện" className="w-full bg-[#2a2a2a] text-sm rounded-full px-4 py-1.5 outline-none placeholder:text-[#a7a7a7]" />
              ) : (
                <>
                  <button onClick={() => setShowSearch(true)} className="p-1.5 hover:bg-[#242424] rounded-full transition">
                    <Search className="w-4 h-4 text-[#a7a7a7] hover:text-white cursor-pointer" />
                  </button>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#a7a7a7] hover:text-white cursor-pointer transition">
                    Gần đây <ArrowUpDown className="w-4 h-4" />
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 overflow-auto px-2 custom-scrollbar">
              {filter === "playlists" ? (
                filteredPlaylists.length === 0 ? (
                  <p className="text-sm text-[#a7a7a7] p-4 text-center">Chưa có playlist nào.</p>
                ) : (
                  filteredPlaylists.map((pl) => (
                    <div key={pl.id} onClick={() => navigate(`/playlist/${pl.id}`)} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition">
                      <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center text-xl shrink-0 shadow-md">🎵</div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium truncate text-white">{pl.name}</p>
                        <p className="text-[13px] text-[#a7a7a7]">Playlist</p>
                      </div>
                    </div>
                  ))
                )
              ) : filteredArtists.length === 0 ? (
                <p className="text-sm text-[#a7a7a7] p-4 text-center">Không có nghệ sĩ nào.</p>
              ) : (
                filteredArtists.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] cursor-pointer transition">
                    {artist.avatarUrl ? (
                      <img src={artist.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 shadow-md" />
                    ) : (
                      <div className="w-12 h-12 bg-[#282828] rounded-full flex items-center justify-center text-xl shrink-0 shadow-md">🎤</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium truncate text-white">{artist.name}</p>
                      <p className="text-[13px] text-[#a7a7a7]">Nghệ sĩ</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="flex flex-col gap-5 px-2 mt-2">
              
              <div className="p-4 bg-[#242424] rounded-xl font-semibold flex flex-col items-start gap-1.5 shadow-sm relative">
                <h1 className="text-[15px] text-white tracking-wide">Tạo danh sách phát đầu tiên của bạn</h1>
                <p className="font-normal text-[13px] text-white/90">Rất dễ! Chúng tôi sẽ giúp bạn</p>
                <button
                  onClick={handleCreateClick}
                  className="px-4 py-1.5 bg-white text-[14px] text-black rounded-full mt-3 font-bold hover:scale-105 transition"
                >
                  Tạo danh sách phát
                </button>

                {showTooltip && (
                  <>
                    <div 
                      className="fixed inset-0 z-[998]" 
                      onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                    ></div>
                    
                    <div className="fixed top-[28%] left-[26vw] w-80 bg-[#0d72ea] text-white p-4 rounded-lg shadow-2xl z-[999] animate-fadeIn cursor-default">
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#0d72ea] rotate-45 rounded-sm"></div>
                      
                      <h3 className="font-bold text-[16px] mb-1">Tạo danh sách phát</h3>
                      <p className="text-[14px] mb-5 font-normal">Đăng nhập để tạo và chia sẻ playlist.</p>
                      <div className="flex justify-end items-center gap-4 font-bold text-[14px]">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} 
                          className="hover:scale-105 text-[#ffffffb3] hover:text-white transition"
                        >
                          Để sau
                        </button>
                        <button 
                          onClick={() => navigate("/login")} 
                          className="bg-white text-black px-6 py-2.5 rounded-full hover:scale-105 transition"
                        >
                          Đăng nhập
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-[#242424] rounded-xl font-semibold flex flex-col items-start gap-1.5 shadow-sm">
                <h1 className="text-[15px] text-white tracking-wide">Hãy cùng tìm và theo dõi một số podcast</h1>
                <p className="font-normal text-[13px] text-white/90">Chúng tôi sẽ cập nhật cho bạn thông tin về các tập mới</p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 bg-white text-[14px] text-black rounded-full mt-3 font-bold hover:scale-105 transition"
                >
                  Duyệt xem podcast
                </button>
              </div>
            </div>

            <div className="mt-auto px-6 mb-8 pt-8 flex flex-col gap-6">
              <div className="flex flex-wrap gap-x-4 gap-y-3 text-[11px] text-[#a7a7a7] font-medium">
                <a href="#" className="hover:underline">Pháp lý</a>
                <a href="#" className="hover:underline">Trung tâm an toàn và quyền riêng tư</a>
                <a href="#" className="hover:underline">Chính sách quyền riêng tư</a>
                <a href="#" className="hover:underline">Cookie</a>
                <a href="#" className="hover:underline">Giới thiệu Quảng cáo</a>
                <a href="#" className="hover:underline">Hỗ trợ tiếp cận</a>
              </div>
              <button className="flex items-center gap-1.5 text-white border border-[#878787] rounded-full px-3 py-1.5 text-[13px] font-bold w-fit hover:border-white hover:scale-105 transition">
                <Globe className="w-4 h-4" /> Tiếng Việt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;