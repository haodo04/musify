// src/utils/recentlyPlayed.js
// Lưu tạm lịch sử "Nghe gần đây" ở localStorage (chưa có bảng riêng ở backend).
// Khi backend có API play-history thật, thay 2 hàm này bằng gọi API tương ứng.

const STORAGE_KEY = "musify_recently_played";
const MAX_ITEMS = 10;

export const getRecentlyPlayedIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Không đọc được lịch sử nghe:", err);
    return [];
  }
};

export const addRecentlyPlayed = (songId) => {
  try {
    const current = getRecentlyPlayedIds().filter((id) => id !== songId);
    const updated = [songId, ...current].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Không lưu được lịch sử nghe:", err);
  }
};