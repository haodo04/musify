import { Radio, LayoutDashboard, Music, Disc3, Mic2, Users, ListMusic, RefreshCw } from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, songsCount, albumsCount, artistsCount, loading, loadData }) {
  return (
    <aside className="w-64 bg-[#121212] border-r border-[#1e1e1e] flex flex-col justify-between shrink-0">
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-[#1e1e1e]">
          <div className="w-9 h-9 rounded-xl bg-[#1db954] flex items-center justify-center shadow-lg shadow-[#1db954]/20">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-white">MUSIFY</h1>
            <p className="text-[10px] text-[#1db954] font-semibold uppercase tracking-widest">Admin Control</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider mb-2">Thống kê</p>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "dashboard" ? "bg-[#1db954] text-black font-bold shadow-lg shadow-[#1db954]/20" : "text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Tổng quan
          </button>

          <p className="px-3 text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider mt-6 mb-2">Quản lý Kho nhạc</p>
          <button
            onClick={() => setActiveTab("songs")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "songs" ? "bg-[#1db954] text-black font-bold shadow-lg shadow-[#1db954]/20" : "text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3"><Music className="w-4 h-4" /> Bài hát</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "songs" ? "bg-black/20 text-black" : "bg-[#282828] text-[#a7a7a7]"}`}>{songsCount}</span>
          </button>

          <button
            onClick={() => setActiveTab("albums")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "albums" ? "bg-[#1db954] text-black font-bold shadow-lg shadow-[#1db954]/20" : "text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3"><Disc3 className="w-4 h-4" /> Album</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "albums" ? "bg-black/20 text-black" : "bg-[#282828] text-[#a7a7a7]"}`}>{albumsCount}</span>
          </button>

          <button
            onClick={() => setActiveTab("artists")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "artists" ? "bg-[#1db954] text-black font-bold shadow-lg shadow-[#1db954]/20" : "text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3"><Mic2 className="w-4 h-4" /> Nghệ sĩ</div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "artists" ? "bg-black/20 text-black" : "bg-[#282828] text-[#a7a7a7]"}`}>{artistsCount}</span>
          </button>

          <p className="px-3 text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider mt-6 mb-2">Hệ thống & User</p>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-[#555] cursor-not-allowed">
            <Users className="w-4 h-4" /> Người dùng <span className="text-[10px] bg-[#222] text-[#777] px-1.5 py-0.5 rounded">Sắp có</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-[#555] cursor-not-allowed">
            <ListMusic className="w-4 h-4" /> Playlist Công cộng <span className="text-[10px] bg-[#222] text-[#777] px-1.5 py-0.5 rounded">Sắp có</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-[#1e1e1e]">
        <button onClick={loadData} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-xs font-semibold text-[#a7a7a7] hover:text-white transition">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Làm mới dữ liệu
        </button>
      </div>
    </aside>
  );
}