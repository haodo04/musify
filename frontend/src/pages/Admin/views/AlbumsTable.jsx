import { Trash2, Pencil } from "lucide-react";

export default function AlbumsTable({ filteredAlbums, onDeleteRequest, onEditRequest }) {
  return (
    <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm text-[#b3b3b3]">
        <thead className="bg-[#181818] text-xs font-bold text-[#a7a7a7] uppercase border-b border-[#282828]">
          <tr>
            <th className="px-6 py-4">Album</th>
            <th className="px-6 py-4">Nghệ sĩ</th>
            <th className="px-6 py-4">Ngày phát hành</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e1e]">
          {filteredAlbums.length === 0 ? (
            <tr><td colSpan="4" className="text-center py-12 text-[#a7a7a7]">Không tìm thấy album nào</td></tr>
          ) : (
            filteredAlbums.map((album) => (
              <tr key={album.id} className="hover:bg-[#1a1a1a] transition">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img src={album.coverUrl || "https://placehold.co/100x100?text=Album"} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <span className="font-semibold text-white">{album.title}</span>
                </td>
                <td className="px-6 py-4 text-white font-medium">{album.artist?.name || "—"}</td>
                <td className="px-6 py-4">{album.releaseDate || "Chưa cập nhật"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEditRequest(album)} className="p-2 rounded-lg bg-[#282828] hover:bg-[#1db954] hover:text-black text-white transition" title="Sửa album">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteRequest(album)} className="p-2 rounded-lg bg-[#282828] hover:bg-red-500 text-white transition" title="Xoá album">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}