import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="bg-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl text-sm font-semibold">Tất cả</p>
        <p className="bg-[#242424] cursor-pointer px-4 py-1 rounded-2xl text-sm font-semibold">Nhạc</p>
        <p className="bg-[#242424] cursor-pointer px-4 py-1 rounded-2xl text-sm font-semibold">Podcast</p>
      </div>
    </>
  );
};

export default Navbar;