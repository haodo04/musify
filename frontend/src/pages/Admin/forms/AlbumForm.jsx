import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { createAlbum, updateAlbum } from "../../../services/adminService";

export default function AlbumForm({ artists, album, onSuccess }) {
  const isEdit = Boolean(album);
  const [title, setTitle] = useState(album?.title || "");
  const [releaseDate, setReleaseDate] = useState(album?.releaseDate || "");
  const [artistId, setArtistId] = useState(album?.artist?.id ? String(album.artist.id) : "");
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(album?.coverUrl || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setCover(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artistId) return;
    setLoading(true);
    try {
      if (isEdit) {
        await updateAlbum(album.id, { title, releaseDate, artistId, coverFile: cover });
        onSuccess("Đã cập nhật Album!");
      } else {
        await createAlbum({ title, releaseDate, artistId, coverFile: cover });
        onSuccess("Tạo Album mới thành công!");
      }
    } catch (err) {
      alert(isEdit ? "Lỗi khi cập nhật album" : "Lỗi khi tạo album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Tên Album *</label>
        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Tên Album..." className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] transition" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Nghệ sĩ *</label>
          <select required value={artistId} onChange={e => setArtistId(e.target.value)} className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] text-white cursor-pointer appearance-none">
            <option value="" disabled>-- Chọn Nghệ sĩ --</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Ngày phát hành</label>
          <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] text-white cursor-pointer" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">
          Ảnh bìa (Cover) {isEdit && <span className="normal-case font-normal text-[#666]">— để trống nếu giữ ảnh cũ</span>}
        </label>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#3e3e3e] hover:border-[#1db954] rounded-2xl cursor-pointer bg-[#181818] transition relative overflow-hidden">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-[#a7a7a7]">
              <ImageIcon className="w-8 h-8 mb-2 text-[#1db954]" />
              <span className="text-sm font-medium">Click để chọn ảnh bìa</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#1db954] text-black font-extrabold py-3.5 rounded-xl hover:bg-[#1ed760] transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2">
        {loading ? "Đang xử lý..." : isEdit ? "Lưu thay đổi" : "Xác nhận Tạo Album"}
      </button>
    </form>
  );
}