import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AppLogo from "../../components/icons/AppLogo";

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

  const handleGoogleClick = () => {
    alert("Tính năng đăng ký bằng Google đang được phát triển");
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

        <button
          onClick={handleGoogleClick}
          className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/20 rounded-full py-2.5 font-bold text-gray-300 hover:text-white hover:border-white hover:bg-white/5 transition-all z-10 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng ký với Google
        </button>

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