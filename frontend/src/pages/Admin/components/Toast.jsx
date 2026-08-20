import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ msg, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all animate-bounce ${
      type === "ok" ? "bg-[#1db954] text-black" : "bg-red-500 text-white"
    }`}>
      {type === "ok" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75"><X className="w-4 h-4" /></button>
    </div>
  );
}