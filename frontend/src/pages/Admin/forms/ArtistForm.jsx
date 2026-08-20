import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { createArtist } from "../../../services/adminService";

export default function ArtistForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setAvatar(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createArtist({ name, bio, avatarFile: avatar });
      onSuccess("Đã thêm nghệ sĩ mới thành công!");
    } catch (err) {
      alert("Lỗi khi thêm nghệ sĩ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Tên Nghệ sĩ *</label>
        <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên nghệ sĩ..." className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] transition" />
      </div>

      <div>
        <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Tiểu sử</label>
        <textarea rows="3" value={bio} onChange={e => setBio(e.target.value)} placeholder="Vài nét về nghệ sĩ..." className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] transition resize-none custom-scrollbar" />
      </div>

      <div>
        <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Ảnh đại diện (Avatar)</label>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#3e3e3e] hover:border-[#1db954] rounded-2xl cursor-pointer bg-[#181818] transition relative overflow-hidden">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-[#a7a7a7]">
              <UploadCloud className="w-8 h-8 mb-2 text-[#1db954]" />
              <span className="text-sm font-medium">Click để chọn ảnh</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#1db954] text-black font-extrabold py-3.5 rounded-xl hover:bg-[#1ed760] transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2">
        {loading ? "Đang xử lý..." : "Xác nhận Thêm Nghệ sĩ"}
      </button>
    </form>
  );
}