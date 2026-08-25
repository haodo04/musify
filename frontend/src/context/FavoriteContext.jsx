import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getMyFavorites, addFavorite, removeFavorite } from "../services/favoriteService";
import toast from "react-hot-toast";

export const FavoriteContext = createContext();

const toastStyle = { style: { background: "#282828", color: "#fff" } };

const FavoriteContextProvider = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const data = await getMyFavorites();
      setFavoriteIds(new Set(data.map((s) => s.id)));
    } catch (err) {
      console.error("Lỗi khi tải bài hát yêu thích:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (songId) => favoriteIds.has(songId);

  const toggleFavorite = async (songId) => {
    if (!isAuthenticated) return false;

    const currentlyFavorite = favoriteIds.has(songId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      currentlyFavorite ? next.delete(songId) : next.add(songId);
      return next;
    });

    try {
      if (currentlyFavorite) {
        await removeFavorite(songId);
        toast.success("Đã xoá khỏi bài hát yêu thích", toastStyle);
      } else {
        await addFavorite(songId);
        toast.success("Đã thêm vào bài hát yêu thích", toastStyle);
      }
      return true;
    } catch (err) {
      // Rollback nếu lỗi
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        currentlyFavorite ? next.add(songId) : next.delete(songId);
        return next;
      });
      toast.error("Có lỗi xảy ra, thử lại sau", toastStyle);
      return false;
    }
  };

  const contextValue = {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    loading,
    refetchFavorites: fetchFavorites,
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {props.children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteContextProvider;