import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import SongItem from "../../components/cards/SongItem";
import { searchSongs, getTrendingSongs } from "../../services/songService";
import { PlayerContext } from "../../context/PlayerContext";
import { AuthContext } from "../../context/AuthContext";
import { FavoriteContext } from "../../context/FavoriteContext";
import { Search as SearchIcon, Play, Pause, Heart } from "lucide-react";

const formatDuration = (seconds) => {
  if (seconds == null) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { track, playStatus } = useContext(PlayerContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const run = async () => {
      try {
        setLoading(true);
        const data = await searchSongs(query);
        setResults(data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query]);

  useEffect(() => {
    if (query) return;
    getTrendingSongs().then(setSuggestions).catch(() => {});
  }, [query]);

  const topResult = results[0];

  return (
    <div className="min-h-full bg-[#121212] pb-10">
      <Navbar />

      {!query ? (
        <div className="px-6 mt-8">
          <h1 className="text-2xl font-bold text-white mb-1">Tìm kiếm</h1>
          <p className="text-[#a7a7a7] text-sm mb-8">
            Gõ tên bài hát hoặc nghệ sĩ vào ô tìm kiếm phía trên để bắt đầu.
          </p>

          {suggestions.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-white mb-4">Có thể bạn sẽ thích</h2>
              <div className="flex flex-wrap gap-6">
                {suggestions.map((s) => (
                  <SongItem key={s.id} id={s.id} name={s.title} desc={s.artist?.name} image={s.imageUrl} queue={suggestions} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="px-6 mt-6">
          <h1 className="text-2xl font-bold text-white mb-6 truncate">
            Kết quả tìm kiếm cho "<span className="text-[#1db954]">{query}</span>"
          </h1>

          {loading ? (
            <p className="text-[#a7a7a7] text-sm font-medium">Đang tìm kiếm...</p>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20">
              <SearchIcon className="w-12 h-12 text-[#a7a7a7] mb-4" />
              <p className="text-white font-bold text-lg mb-1">
                Không tìm thấy kết quả nào cho "{query}"
              </p>
              <p className="text-[#a7a7a7] text-sm">Hãy kiểm tra lại chính tả hoặc thử một từ khoá khác.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {topResult && (
                <div className="lg:w-[360px] shrink-0">
                  <h2 className="text-xl font-bold text-white mb-4">Kết quả hàng đầu</h2>
                  <div
                    onClick={() => navigate(`/song/${topResult.id}`)}
                    className="bg-[#181818] hover:bg-[#232323] transition-colors rounded-xl p-5 cursor-pointer group relative"
                  >
                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(topResult.id);
                        }}
                        title={isFavorite(topResult.id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all ${
                          isFavorite(topResult.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(topResult.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                      </button>
                    )}
                    <img
                      src={topResult.imageUrl || "https://placehold.co/200x200?text=Song"}
                      alt={topResult.title}
                      className="w-24 h-24 rounded-lg object-cover shadow-lg mb-4"
                    />
                    <p className="text-white font-black text-2xl truncate mb-1">{topResult.title}</p>
                    <p className="text-[#a7a7a7] text-sm">
                      Bài hát • <span className="font-medium">{topResult.artist?.name || "Đang cập nhật"}</span>
                    </p>
                    <div className="absolute bottom-5 right-5 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl hover:scale-105">
                      <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white mb-4">Bài hát</h2>
                <div className="flex flex-col">
                  {results.map((item, index) => {
                    const isActive = track?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/song/${item.id}`)}
                        className="grid grid-cols-[30px_1fr_60px_36px] gap-3 sm:gap-4 p-2.5 items-center text-[#a7a7a7] hover:bg-[#ffffff1a] rounded-md cursor-pointer transition group"
                      >
                        <div className="text-right text-base font-medium">
                          {isActive && playStatus ? (
                            <Pause className="w-4 h-4 fill-[#1db954] text-[#1db954] ml-auto" />
                          ) : (
                            <>
                              <span className="group-hover:hidden">{index + 1}</span>
                              <Play className="w-4 h-4 fill-white text-white hidden group-hover:inline-block ml-auto" />
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl || "https://placehold.co/100x100"}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded shadow-md"
                          />
                          <div className="min-w-0 flex-1">
                            <p className={`text-base font-medium truncate ${isActive ? "text-[#1db954]" : "text-white group-hover:text-[#1db954]"}`}>
                              {item.title}
                            </p>
                            <p className="text-sm truncate">{item.artist?.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-right font-medium">{formatDuration(item.duration)}</p>

                        {isAuthenticated ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id);
                            }}
                            title={isFavorite(item.id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
                            className={`flex items-center justify-center text-[#a7a7a7] hover:text-white transition p-1 ${
                              isFavorite(item.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                          </button>
                        ) : (
                          <div />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;