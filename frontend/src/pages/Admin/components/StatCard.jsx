export default function StatCard({ icon, title, value, unit, color }) {
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${color} to-[#121212] border border-[#1e1e1e] flex items-center justify-between`}>
      <div>
        <p className="text-xs font-semibold text-[#a7a7a7] mb-1">{title}</p>
        <h4 className="text-2xl font-extrabold text-white">{value} <span className="text-xs font-normal text-[#a7a7a7]">{unit}</span></h4>
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#282828] flex items-center justify-center text-xl shadow-inner">
        {icon}
      </div>
    </div>
  );
}