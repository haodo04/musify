import { Sparkles, X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#181818] border border-[#282828] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282828]">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1db954]" />
            {title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#282828] text-[#a7a7a7] hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>
  );
}