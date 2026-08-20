import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white cursor-pointer transition hover:scale-105"
          title="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white cursor-pointer transition hover:scale-105"
          title="Tiến tới"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-2 mt-4 animate-fadeIn">
          <p className="bg-white text-black px-4 py-1 rounded-2xl text-sm font-semibold cursor-pointer hover:scale-105 transition">
            Tất cả
          </p>
          <p className="bg-[#242424] hover:bg-[#2a2a2a] text-white cursor-pointer px-4 py-1 rounded-2xl text-sm font-semibold transition">
            Nhạc
          </p>
          <p className="bg-[#242424] hover:bg-[#2a2a2a] text-white cursor-pointer px-4 py-1 rounded-2xl text-sm font-semibold transition">
            Podcast
          </p>
        </div>
      )}
    </>
  );
};

export default Navbar;