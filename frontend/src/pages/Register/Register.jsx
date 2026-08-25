import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AppLogo from "../../components/icons/AppLogo";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại, thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl flex flex-col md:flex-row rounded-1xl bg-[#121212]/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-10 overflow-hidden">
      
      <div className="hidden md:block md:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop" 
          alt="DJ Music Vibe" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-[#121212]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-transparent to-transparent"></div>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
        
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-[#1db954]/20 rounded-full blur-[70px] pointer-events-none"></div>

        <AppLogo className="w-10 h-10 mb-3 drop-shadow-lg" />
        <h1 className="text-2xl md:text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
          Bắt đầu nghe nhạc
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center animate-fadeIn">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#1a1a1a] border border-transparent rounded-xl p-3 text-white text-sm outline-none focus:border-[#1db954] focus:bg-[#242424] transition-all shadow-inner"
              placeholder="Tên hiển thị của bạn"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1a1a1a] border border-transparent rounded-xl p-3 text-white text-sm outline-none focus:border-[#1db954] focus:bg-[#242424] transition-all shadow-inner"
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wider">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1a1a1a] border border-transparent rounded-xl p-3 text-white text-sm outline-none focus:border-[#1db954] focus:bg-[#242424] transition-all shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1db954] hover:bg-[#1ed760] hover:scale-[1.02] active:scale-95 transition-all text-black font-extrabold py-3 rounded-full mt-2 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(29,185,84,0.3)] text-sm"
          >
            {loading ? "Đang xử lý..." : "Đăng ký miễn phí"}
          </button>
        </form>

        <div className="flex items-center gap-3 w-full my-5 z-10">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">hoặc</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <GoogleLoginButton />

        <p className="text-xs text-gray-400 text-center mt-6 z-10">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-white font-bold hover:text-[#1db954] transition-colors hover:underline underline-offset-4">
            Đăng nhập
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Register;