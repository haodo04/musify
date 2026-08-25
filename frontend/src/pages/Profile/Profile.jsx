import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile } from "../../services/userService";
import Navbar from "../../components/layout/Navbar";
import { Camera, MoreHorizontal, Settings } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile(username, avatarFile);
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      if (setUser) {
        setUser(updatedUser);
      }
      
      toast.success("Cập nhật hồ sơ thành công!", { style: { background: "#282828", color: "#fff" } });
      
      setIsEditing(false); 
    } catch (err) {
      toast.error("Cập nhật thất bại!", { style: { background: "#282828", color: "#fff" } });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-full text-white pb-10">
      
      <div className="bg-gradient-to-b from-[#3e3e3e] to-[#121212] px-6 pt-4 pb-8">
        <Navbar />
        
        <div className="mt-8 flex flex-col md:flex-row items-end gap-6 md:gap-8">
          
          <div 
            className="relative w-48 h-48 md:w-[232px] md:h-[232px] rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.5)] group cursor-pointer shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-[#282828] flex items-center justify-center rounded-full text-white font-bold text-7xl md:text-9xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-10 h-10 text-white mb-2" />
              <span className="text-white font-bold text-sm md:text-base">Chọn ảnh</span>
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col items-start flex-1 min-w-0 pb-1">
            <p className="text-sm font-bold uppercase mb-1 tracking-wide">Hồ sơ</p>
            
            {isEditing ? (
              <input 
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-black/30 text-white text-5xl md:text-8xl font-black rounded-lg px-2 py-1 outline-none border-b border-white mb-4 w-full max-w-xl truncate"
              />
            ) : (
              <h1 
                onClick={() => setIsEditing(true)}
                className="text-5xl md:text-8xl font-black mb-4 text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity truncate max-w-full"
                title="Nhấn để đổi tên"
              >
                {user?.username}
              </h1>
            )}

            <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
              <span>• 4 đang theo dõi</span>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setIsEditing(false); setPreview(user?.avatarUrl); setUsername(user?.username); }} className="px-5 py-2 rounded-full font-bold text-white border border-[#727272] hover:border-white transition text-sm">Hủy</button>
                <button onClick={handleSave} disabled={loading} className="px-5 py-2 rounded-full font-bold text-black bg-[#1db954] hover:bg-[#1ed760] hover:scale-105 transition disabled:opacity-50 text-sm">
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 flex items-center gap-6">
        <Settings className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
        <MoreHorizontal className="w-8 h-8 text-[#a7a7a7] hover:text-white cursor-pointer transition" />
      </div>

      <div className="px-6 mt-4">
         <h2 className="text-2xl font-bold text-white mb-6">Bản nhạc hàng đầu tháng này</h2>
         <p className="text-sm text-[#a7a7a7]">Chỉ hiển thị với bạn</p>
      </div>

    </div>
  );
};

export default Profile;