import { Search, Plus } from "lucide-react";

export default function AdminHeader({ activeTab, searchQuery, setSearchQuery, setModalOpen }) {
  return (
    <header className="h-20 border-b border-[#1e1e1e] px-8 flex items-center justify-between gap-4 bg-[#0d0d0d]/80 backdrop-blur-md">
      <h2 className="text-xl font-bold tracking-tight capitalize">
        {activeTab === "dashboard" && "Tổng quan hệ thống"}
        {activeTab === "songs" && "Danh sách Bài hát"}
        {activeTab === "albums" && "Danh sách Album"}
        {activeTab === "artists" && "Danh sách Nghệ sĩ"}
      </h2>

      <div className="flex items-center gap-4">
        {activeTab !== "dashboard" && (
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a7a7a7]" />
            <input
              type="text"
              placeholder={`Tìm kiếm trong ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-[#282828] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#6a6a6a] outline-none focus:border-[#1db954] transition"
            />
          </div>
        )}

        {activeTab !== "dashboard" && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#1db954] hover:bg-[#1ed760] text-black font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-[#1db954]/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Thêm {activeTab === "artists" ? "Nghệ sĩ" : activeTab === "albums" ? "Album" : "Bài hát"}
          </button>
        )}

        <div className="flex items-center gap-3 pl-4 border-l border-[#282828]">
          <div className="w-9 h-9 rounded-full bg-[#282828] flex items-center justify-center font-bold text-sm text-[#1db954] border border-[#3e3e3e]">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}