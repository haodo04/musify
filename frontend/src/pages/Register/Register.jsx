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
    <div className="w-full max-w-sm flex flex-col items-center px-4">
      <AppLogo className="w-10 h-10 mb-3" />
      <h1 className="text-2xl font-bold mb-5 text-center">Đăng ký để bắt đầu nghe nhạc</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Tên người dùng</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black border border-[#727272] rounded p-2.5 outline-none focus:border-white"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-[#727272] rounded p-2.5 outline-none focus:border-white placeholder:text-[#727272]"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-[#727272] rounded p-2.5 outline-none focus:border-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 hover:scale-105 transition text-black font-bold py-2.5 rounded-full mt-1 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </form>

      <div className="flex items-center gap-3 w-full my-4">
        <div className="flex-1 h-px bg-[#727272]" />
        <span className="text-sm text-[#a7a7a7]">hoặc</span>
        <div className="flex-1 h-px bg-[#727272]" />
      </div>

      <button
        onClick={handleGoogleClick}
        className="w-full flex items-center justify-center gap-3 border border-[#727272] rounded-full py-2.5 font-bold hover:border-white transition"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Đăng ký với Google
      </button>

      <p className="text-sm text-[#a7a7a7] text-center mt-5">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-white font-bold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default Register;