import { Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-16 pt-12 pb-10 px-2 sm:px-6 text-[#a7a7a7] text-sm font-sans">
  
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-10">
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-10">
          <div className="flex flex-col gap-4">
            <p className="font-extrabold text-white text-[15px] mb-1">Công ty</p>
            <a href="#" className="hover:text-white hover:underline transition">Giới thiệu</a>
            <a href="#" className="hover:text-white hover:underline transition">Việc làm</a>
            <a href="#" className="hover:text-white hover:underline transition">For the Record</a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-extrabold text-white text-[15px] mb-1">Cộng đồng</p>
            <a href="#" className="hover:text-white hover:underline transition">Dành cho nghệ sĩ</a>
            <a href="#" className="hover:text-white hover:underline transition">Nhà phát triển</a>
            <a href="#" className="hover:text-white hover:underline transition">Quảng cáo</a>
            <a href="#" className="hover:text-white hover:underline transition">Nhà đầu tư</a>
            <a href="#" className="hover:text-white hover:underline transition">Nhà cung cấp</a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-extrabold text-white text-[15px] mb-1">Liên kết hữu ích</p>
            <a href="#" className="hover:text-white hover:underline transition">Hỗ trợ</a>
            <a href="#" className="hover:text-white hover:underline transition">Ứng dụng Di động miễn phí</a>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] text-white rounded-full flex items-center justify-center transition hover:scale-105 shadow-md">
            <FaInstagram className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] text-white rounded-full flex items-center justify-center transition hover:scale-105 shadow-md">
            <FaTwitter className="w-5 h-5 fill-current" />
          </button>
          <button className="w-10 h-10 bg-[#292929] hover:bg-[#727272] text-white rounded-full flex items-center justify-center transition hover:scale-105 shadow-md">
            <FaFacebook className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="border-t border-[#292929] pt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-medium">
          <a href="#" className="hover:text-white transition">Pháp lý</a>
          <a href="#" className="hover:text-white transition">Trung tâm an toàn & quyền riêng tư</a>
          <a href="#" className="hover:text-white transition">Chính sách quyền riêng tư</a>
          <a href="#" className="hover:text-white transition">Cookie</a>
          <a href="#" className="hover:text-white transition">Giới thiệu quảng cáo</a>
          <a href="#" className="hover:text-white transition">Hỗ trợ tiếp cận</a>
        </div>

        <div className="flex flex-col md:items-end gap-3 shrink-0">
          <button className="flex items-center gap-1.5 text-[#a7a7a7] hover:text-white text-[13px] font-bold transition">
            <Globe className="w-4 h-4" />
            Tiếng Việt
          </button>
          <p className="text-[13px] text-[#a7a7a7]">© 2024 Musify AB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;