import { Trash2 } from "lucide-react";

export default function ArtistsTable({ filteredArtists, onDeleteRequest }) {
  return (
    <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm text-[#b3b3b3]">
        <thead className="bg-[#181818] text-xs font-bold text-[#a7a7a7] uppercase border-b border-[#282828]">
          <tr>
            <th className="px-6 py-4">Nghệ sĩ</th>
            <th className="px-6 py-4">Tiểu sử (Bio)</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e1e]">
          {filteredArtists.length === 0 ? (
            <tr><td colSpan="3" className="text-center py-12 text-[#a7a7a7]">Không tìm thấy nghệ sĩ nào</td></tr>
          ) : (
            filteredArtists.map((artist) => (
              <tr key={artist.id} className="hover:bg-[#1a1a1a] transition">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={artist.avatarUrl || "https://placehold.co/100x100?text=Artist"} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                  <span className="font-bold text-white text-base">{artist.name}</span>
                </td>
                <td className="px-6 py-4 max-w-md truncate">{artist.bio || "Chưa có thông tin mô tả."}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDeleteRequest(artist)} className="p-2 rounded-lg bg-[#282828] hover:bg-red-500 text-white transition" title="Xoá nghệ sĩ">
                    <Trash2 className="w-4 h-4" />
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