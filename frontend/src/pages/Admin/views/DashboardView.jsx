import StatCard from "../components/StatCard";
import { Music, Disc3, Mic2, TrendingUp, Sparkles, Plus, BarChart3, Play } from "lucide-react";

export default function DashboardView({ songs, albums, artists, totalPlays, setActiveTab, setModalOpen, playWithId }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<Music className="text-[#1db954]" />} title="Bài hát trên Cloud" value={songs.length} unit="Bài" color="from-[#1db954]/10" />
        <StatCard icon={<Disc3 className="text-blue-400" />} title="Album phát hành" value={albums.length} unit="Album" color="from-blue-500/10" />
        <StatCard icon={<Mic2 className="text-purple-400" />} title="Nghệ sĩ hợp tác" value={artists.length} unit="Ca sĩ" color="from-purple-500/10" />
        <StatCard icon={<TrendingUp className="text-amber-400" />} title="Tổng lượt nghe" value={totalPlays.toLocaleString()} unit="Lượt" color="from-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1db954]" /> Thao tác nhanh
            </h3>
            <p className="text-xs text-[#a7a7a7] mb-6">Thêm mới nội dung trực tiếp vào hệ thống cơ sở dữ liệu Cloudinary & MySQL.</p>
            
            <div className="space-y-3">
              <button onClick={() => { setActiveTab("artists"); setModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-[#181818] hover:bg-[#222] border border-[#282828] rounded-xl text-sm font-medium transition">
                <span className="flex items-center gap-3"><Mic2 className="w-4 h-4 text-purple-400" /> Tạo Nghệ sĩ mới</span>
                <Plus className="w-4 h-4 text-[#a7a7a7]" />
              </button>
              <button onClick={() => { setActiveTab("albums"); setModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-[#181818] hover:bg-[#222] border border-[#282828] rounded-xl text-sm font-medium transition">
                <span className="flex items-center gap-3"><Disc3 className="w-4 h-4 text-blue-400" /> Tạo Album mới</span>
                <Plus className="w-4 h-4 text-[#a7a7a7]" />
              </button>
              <button onClick={() => { setActiveTab("songs"); setModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-[#181818] hover:bg-[#222] border border-[#282828] rounded-xl text-sm font-medium transition">
                <span className="flex items-center gap-3"><Music className="w-4 h-4 text-[#1db954]" /> Upload Bài hát mới</span>
                <Plus className="w-4 h-4 text-[#a7a7a7]" />
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#181818] border border-[#282828] text-xs text-[#a7a7a7]">
            💡 <b className="text-white">Lưu ý:</b> Dữ liệu file nhạc (.mp3) và ảnh bìa được tải trực tiếp lên bộ nhớ đám mây Cloudinary.
          </div>
        </div>

        {/* Recent Uploaded Songs */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1db954]" /> Bài hát vừa tải lên gần đây
            </h3>
            <button onClick={() => setActiveTab("songs")} className="text-xs font-bold text-[#1db954] hover:underline">
              Xem tất cả ({songs.length})
            </button>
          </div>

          {songs.length === 0 ? (
            <div className="text-center py-12 text-[#a7a7a7] text-sm">Chưa có bài hát nào trên hệ thống</div>
          ) : (
            <div className="space-y-3">
              {songs.slice(0, 5).map((song) => (
                <div key={song.id} className="flex items-center justify-between p-3 bg-[#181818] hover:bg-[#222] rounded-xl transition border border-[#222]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.imageUrl || "https://placehold.co/100x100?text=Song"} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate text-white">{song.title}</p>
                      <p className="text-xs text-[#a7a7a7] truncate">{song.artist?.name || "Chưa rõ nghệ sĩ"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2.5 py-1 bg-[#282828] text-[#1db954] rounded-full font-medium">{song.genre || "Pop"}</span>
                    <button onClick={() => playWithId(song.id)} className="w-8 h-8 rounded-full bg-[#1db954] text-black flex items-center justify-center hover:scale-105 transition">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}