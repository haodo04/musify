import { useState } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { createSong } from "../../../services/adminService";

export default function SongForm({ artists, albums, onSuccess }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [duration, setDuration] = useState(""); 
  const [artistId, setArtistId] = useState("");
  const [albumId, setAlbumId] = useState("");
  
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      const audioObj = new Audio(URL.createObjectURL(file));
      audioObj.onloadedmetadata = () => {
        setDuration(Math.round(audioObj.duration));
      };
    }
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !artistId || !audioFile) {
      alert("Vui lòng nhập tên, chọn nghệ sĩ và đính kèm file nhạc!");
      return;
    }
    setLoading(true);
    try {
      await createSong({ 
        title, genre, 
        duration: Number(duration),
        artistId, albumId: albumId || null, 
        audioFile, imageFile 
      });
      onSuccess("Upload bài hát lên hệ thống thành công!");
    } catch (err) {
      alert("Lỗi khi tải bài hát lên");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-4">
        <div className="w-32 h-32 shrink-0">
          <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-[#3e3e3e] hover:border-[#1db954] rounded-2xl cursor-pointer bg-[#181818] transition relative overflow-hidden group">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover group-hover:brightness-50 transition" />
                <UploadCloud className="w-6 h-6 text-white absolute opacity-0 group-hover:opacity-100 transition" />
              </>
            ) : (
              <div className="flex flex-col items-center text-[#a7a7a7] p-2 text-center">
                <ImageIcon className="w-6 h-6 mb-1 text-[#a7a7a7]" />
                <span className="text-[10px] font-medium">Ảnh bìa</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Tên Bài hát *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Tên bài hát..." className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1db954] transition" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">File Âm thanh (.mp3) *</label>
            <input type="file" accept="audio/*" required onChange={handleAudioChange} className="w-full text-sm text-[#a7a7a7] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1db954] file:text-black hover:file:bg-[#1ed760] file:cursor-pointer transition cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Nghệ sĩ thể hiện *</label>
          <select required value={artistId} onChange={e => setArtistId(e.target.value)} className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] text-white cursor-pointer appearance-none">
            <option value="" disabled>-- Chọn Nghệ sĩ --</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Thuộc Album (Tùy chọn)</label>
          <select value={albumId} onChange={e => setAlbumId(e.target.value)} disabled={!artistId} className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] text-white cursor-pointer appearance-none disabled:opacity-50">
            <option value="">-- Đĩa đơn --</option>
            {albums.filter(alb => String(alb.artist?.id) === String(artistId)).map(alb => (
              <option key={alb.id} value={alb.id}>{alb.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Thể loại</label>
          <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1db954] transition" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#a7a7a7] uppercase mb-1.5 block">Thời lượng (Tự tính)</label>
          <input type="text" value={duration ? `${duration} giây` : "Đang chờ file nhạc..."} disabled className="w-full bg-[#181818] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none text-[#a7a7a7] cursor-not-allowed" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#1db954] text-black font-extrabold py-3.5 rounded-xl hover:bg-[#1ed760] transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
        {loading ? (
          <> <UploadCloud className="w-5 h-5 animate-bounce" /> Đang đẩy lên Cloudinary... </>
        ) : "Xác nhận Upload Bài hát"}
      </button>
    </form>
  );
}