import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getMyFollowedArtists, followArtist, unfollowArtist } from "../services/followService";
import toast from "react-hot-toast";

export const FollowContext = createContext();

const toastStyle = { style: { background: "#282828", color: "#fff" } };

const FollowContextProvider = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchFollowed = useCallback(async () => {
    if (!isAuthenticated) {
      setFollowedIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const data = await getMyFollowedArtists();
      setFollowedIds(new Set(data.map((a) => a.id)));
    } catch (err) {
      console.error("Lỗi khi tải danh sách theo dõi:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFollowed();
  }, [fetchFollowed]);

  const isFollowing = (artistId) => followedIds.has(artistId);

  const toggleFollow = async (artistId) => {
    if (!isAuthenticated) return false;

    const currentlyFollowing = followedIds.has(artistId);

    setFollowedIds((prev) => {
      const next = new Set(prev);
      currentlyFollowing ? next.delete(artistId) : next.add(artistId);
      return next;
    });

    try {
      if (currentlyFollowing) {
        await unfollowArtist(artistId);
        toast.success("Đã bỏ theo dõi", toastStyle);
      } else {
        await followArtist(artistId);
        toast.success("Đã theo dõi nghệ sĩ!", toastStyle);
      }
      return true;
    } catch (err) {
      setFollowedIds((prev) => {
        const next = new Set(prev);
        currentlyFollowing ? next.add(artistId) : next.delete(artistId);
        return next;
      });
      toast.error("Có lỗi xảy ra, thử lại sau", toastStyle);
      return false;
    }
  };

  const contextValue = {
    followedIds,
    isFollowing,
    toggleFollow,
    loading,
    refetchFollowed: fetchFollowed,
  };

  return (
    <FollowContext.Provider value={contextValue}>
      {props.children}
    </FollowContext.Provider>
  );
};

export default FollowContextProvider;