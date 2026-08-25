import { useState } from "react";
import { Shield, ShieldCheck, ShieldOff } from "lucide-react";

export default function UsersTable({ filteredUsers, currentUserEmail, onRoleChange }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleToggleRole = async (user) => {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(user.id);
    await onRoleChange(user.id, nextRole);
    setUpdatingId(null);
  };

  return (
    <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left text-sm text-[#b3b3b3]">
        <thead className="bg-[#181818] text-xs font-bold text-[#a7a7a7] uppercase border-b border-[#282828]">
          <tr>
            <th className="px-6 py-4">Người dùng</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Ngày tham gia</th>
            <th className="px-6 py-4 text-center">Vai trò</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e1e1e]">
          {filteredUsers.length === 0 ? (
            <tr><td colSpan="5" className="text-center py-12 text-[#a7a7a7]">Không tìm thấy người dùng nào</td></tr>
          ) : (
            filteredUsers.map((u) => {
              const isSelf = u.email === currentUserEmail;
              const isAdmin = u.role === "ADMIN";
              return (
                <tr key={u.id} className="hover:bg-[#1a1a1a] transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#282828] flex items-center justify-center font-bold text-xs text-[#1db954] shrink-0">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-white">{u.username}</span>
                    {isSelf && <span className="text-[10px] bg-[#282828] text-[#a7a7a7] px-1.5 py-0.5 rounded">Bạn</span>}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isAdmin ? "bg-[#1db954]/15 text-[#1db954] border border-[#1db954]/30" : "bg-[#282828] text-[#a7a7a7] border border-[#333]"
                    }`}>
                      {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={isSelf || updatingId === u.id}
                      title={isSelf ? "Không thể tự đổi quyền của chính mình" : isAdmin ? "Hạ xuống User" : "Phong lên Admin"}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed ${
                        isAdmin ? "bg-[#282828] hover:bg-red-500 hover:text-white text-[#a7a7a7]" : "bg-[#282828] hover:bg-[#1db954] hover:text-black text-[#a7a7a7]"
                      }`}
                    >
                      {updatingId === u.id ? "Đang xử lý..." : isAdmin ? (<><ShieldOff className="w-3.5 h-3.5" /> Hạ quyền</>) : (<><ShieldCheck className="w-3.5 h-3.5" /> Phong Admin</>)}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}