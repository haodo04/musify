import { Play } from "lucide-react";

export default function SongsTable({ filteredSongs, playWithId }) {
  return (
    <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm text-[#b3b3b3]">
        <thead className="bg-[#181818] text-xs font-bold text-[#a7a7a7] uppercase border-b border-[#282828]">
          <tr>
            <th className="px-6 py-4">Bài hát</th>
            <th className="px-6 py-4">Nghệ sĩ</th>
            <th className="px-6 py-4">Thể loại</th>
            <th className="px-6 py-4 text-center">Thời lượng</th>
            <th className="px-6 py-4 text-center">Lượt nghe</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e1e]">
          {filteredSongs.length === 0 ? (
            <tr><td colSpan="6" className="text-center py-12 text-[#a7a7a7]">Không tìm thấy bài hát nào</td></tr>
          ) : (
            filteredSongs.map((song) => (
              <tr key={song.id} className="hover:bg-[#1a1a1a] transition">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={song.imageUrl || "https://placehold.co/100x100?text=Song"} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <span className="font-semibold text-white truncate max-w-xs">{song.title}</span>
                </td>
                <td className="px-6 py-4 text-white font-medium">{song.artist?.name || "—"}</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-md bg-[#222] text-[#1db954] text-xs border border-[#333]">{song.genre || "N/A"}</span></td>
                <td className="px-6 py-4 text-center">{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : "—"}</td>
                <td className="px-6 py-4 text-center font-semibold text-white">{song.playCount || 0}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => playWithId(song.id)} className="p-2 rounded-lg bg-[#282828] hover:bg-[#1db954] hover:text-black text-white transition">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}