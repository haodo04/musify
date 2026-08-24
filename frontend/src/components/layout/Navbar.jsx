import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate(-1)}
        className="text-white/70 hover:text-white cursor-pointer transition hover:scale-110"
        title="Quay lại"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        onClick={() => navigate(1)}
        className="text-white/70 hover:text-white cursor-pointer transition hover:scale-110"
        title="Tiến tới"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
};

export default Navbar;