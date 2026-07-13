import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-[#292929] text-[#a7a7a7] text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-white mb-1">Công ty</p>
          <p className="hover:text-white hover:underline cursor-pointer">Giới thiệu</p>
          <p className="hover:text-white hover:underline cursor-pointer">Việc làm</p>
          <p className="hover:text-white hover:underline cursor-pointer">Thông tin dành cho nhà đầu tư</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-white mb-1">Cộng đồng</p>
          <p className="hover:text-white hover:underline cursor-pointer">Dành cho nghệ sĩ</p>
          <p className="hover:text-white hover:underline cursor-pointer">Nhà phát triển</p>
          <p className="hover:text-white hover:underline cursor-pointer">Quảng cáo</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-white mb-1">Liên kết hữu ích</p>
          <p className="hover:text-white hover:underline cursor-pointer">Hỗ trợ</p>
          <p className="hover:text-white hover:underline cursor-pointer">Ứng dụng di động</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-[#292929]">
        <div className="flex flex-wrap gap-4">
          <p className="hover:text-white hover:underline cursor-pointer">Pháp lý</p>
          <p className="hover:text-white hover:underline cursor-pointer">Trung tâm an toàn &amp; quyền riêng tư</p>
          <p className="hover:text-white hover:underline cursor-pointer">Chính sách quyền riêng tư</p>
          <p className="hover:text-white hover:underline cursor-pointer">Cookie</p>
          <p className="hover:text-white hover:underline cursor-pointer">Giới thiệu quảng cáo</p>
          <p className="hover:text-white hover:underline cursor-pointer">Khả năng truy cập</p>
        </div>
        <button className="flex items-center gap-2 border border-[#727272] rounded-full px-3 py-1.5 hover:border-white transition w-fit">
          <Globe className="w-4 h-4" />
          Tiếng Việt
        </button>
      </div>
    </footer>
  );
};

export default Footer;