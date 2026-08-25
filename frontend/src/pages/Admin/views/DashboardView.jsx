import StatCard from "../components/StatCard";
import { Music, Disc3, Mic2, TrendingUp, Sparkles, Plus, BarChart3, Play, Users, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const GENRE_COLORS = ["#1db954", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899", "#22d3ee", "#f43f5e", "#84cc16"];

export default function DashboardView({ songs = [], albums = [], artists = [], users = [], totalPlays, setActiveTab, setModalOpen, playWithId }) {
  // Top 6 bài hát nghe nhiều nhất
  const topSongs = [...songs]
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 6)
    .map((s) => ({ name: s.title.length > 14 ? s.title.slice(0, 14) + "…" : s.title, plays: s.playCount || 0 }));

  // Phân bố thể loại
  const genreMap = {};
  songs.forEach((s) => {
    const g = s.genre || "Khác";
    genreMap[g] = (genreMap[g] || 0) + 1;
  });
  const genreData = Object.entries(genreMap).map(([name, value]) => ({ name, value }));

  // Số bài hát theo nghệ sĩ (top 6)
  const artistSongCount = {};
  songs.forEach((s) => {
    const name = s.artist?.name || "Chưa rõ";
    artistSongCount[name] = (artistSongCount[name] || 0) + 1;
  });
  const artistData = Object.entries(artistSongCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.length > 12 ? name.slice(0, 12) + "…" : name, count }));

  const avgDuration = songs.length > 0
    ? Math.round(songs.reduce((acc, s) => acc + (s.duration || 0), 0) / songs.length)
    : 0;

  const topArtistByPlays = (() => {
    const map = {};
    songs.forEach((s) => {
      const name = s.artist?.name || "Chưa rõ";
      map[name] = (map[name] || 0) + (s.playCount || 0);
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "—";
  })();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<Music className="text-[#1db954]" />} title="Bài hát trên Cloud" value={songs.length} unit="Bài" color="from-[#1db954]/10" />
        <StatCard icon={<Disc3 className="text-blue-400" />} title="Album phát hành" value={albums.length} unit="Album" color="from-blue-500/10" />
        <StatCard icon={<Mic2 className="text-purple-400" />} title="Nghệ sĩ hợp tác" value={artists.length} unit="Ca sĩ" color="from-purple-500/10" />
        <StatCard icon={<TrendingUp className="text-amber-400" />} title="Tổng lượt nghe" value={totalPlays.toLocaleString()} unit="Lượt" color="from-amber-500/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={<Users className="text-cyan-400" />} title="Người dùng" value={users?.length ?? 0} unit="Tài khoản" color="from-cyan-500/10" />
        <StatCard icon={<Clock className="text-rose-400" />} title="Thời lượng TB" value={avgDuration ? `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, "0")}` : "—"} unit="Phút:Giây" color="from-rose-500/10" />
        <StatCard icon={<Mic2 className="text-emerald-400" />} title="Nghệ sĩ nổi bật" value={topArtistByPlays} unit="" color="from-emerald-500/10" />
        <StatCard icon={<Disc3 className="text-indigo-400" />} title="Thể loại đang có" value={genreData.length} unit="Loại" color="from-indigo-500/10" />
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6">
          <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1db954]" /> Top bài hát nghe nhiều nhất
          </h3>
          {topSongs.length === 0 ? (
            <div className="text-center py-16 text-[#a7a7a7] text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSongs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                <XAxis dataKey="name" tick={{ fill: "#a7a7a7", fontSize: 11 }} axisLine={{ stroke: "#282828" }} />
                <YAxis tick={{ fill: "#a7a7a7", fontSize: 11 }} axisLine={{ stroke: "#282828" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#181818", border: "1px solid #282828", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="plays" fill="#1db954" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6">
          <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-[#1db954]" /> Phân bố thể loại
          </h3>
          {genreData.length === 0 ? (
            <div className="text-center py-16 text-[#a7a7a7] text-sm">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={{ fill: "#a7a7a7", fontSize: 11 }}>
                  {genreData.map((_, idx) => (
                    <Cell key={idx} fill={GENRE_COLORS[idx % GENRE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#181818", border: "1px solid #282828", borderRadius: 8, color: "#fff" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#a7a7a7" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-6">
        <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-[#1db954]" /> Số bài hát theo nghệ sĩ (Top 6)
        </h3>
        {artistData.length === 0 ? (
          <div className="text-center py-16 text-[#a7a7a7] text-sm">Chưa có dữ liệu</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={artistData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#282828" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#a7a7a7", fontSize: 11 }} axisLine={{ stroke: "#282828" }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#a7a7a7", fontSize: 11 }} axisLine={{ stroke: "#282828" }} width={90} />
              <Tooltip contentStyle={{ background: "#181818", border: "1px solid #282828", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
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
              <button onClick={() => setActiveTab("users")} className="w-full flex items-center justify-between p-3.5 bg-[#181818] hover:bg-[#222] border border-[#282828] rounded-xl text-sm font-medium transition">
                <span className="flex items-center gap-3"><Users className="w-4 h-4 text-cyan-400" /> Quản lý người dùng</span>
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