import { createContext, useEffect, useRef, useState } from "react";
import { getAllSongs } from "../services/songService";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [songsData, setSongsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: 0,
    totalTime: 0,
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs();
        setSongsData(data);
        if (data.length > 0) setTrack(data[0]);
      } catch (err) {
        console.error("Loi khi tai danh sach bai hat:", err);
      }
    };
    fetchSongs();
  }, []);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id) => {
    const song = songsData.find((s) => s.id === id);
    if (!song) return;
    setTrack(song);
    setPlayStatus(true);
  };

  const previous = async () => {
    const currentIndex = songsData.findIndex((s) => s.id === track?.id);
    if (currentIndex > 0) {
      setTrack(songsData[currentIndex - 1]);
      setPlayStatus(true);
    }
  };

  const next = async () => {
    const currentIndex = songsData.findIndex((s) => s.id === track?.id);
    if (currentIndex < songsData.length - 1) {
      setTrack(songsData[currentIndex + 1]);
      setPlayStatus(true);
    }
  };

  const seekSong = async (e) => {
    if (audioRef.current && seekBg.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  // Khi track đổi và playStatus = true, tự phát bài mới (thay cho audioRef.current.play() rải rác)
  useEffect(() => {
    if (playStatus && audioRef.current) {
      audioRef.current.play();
    }
  }, [track]);

  // Gán ontimeupdate ngay khi audioRef.current đã sẵn sàng (không phụ thuộc setTimeout cố định)
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.ontimeupdate = () => {
      if (seekBar.current && audioRef.current.duration) {
        seekBar.current.style.width =
          Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + "%";
      }
      setTime({
        currentTime: audioRef.current.currentTime,
        totalTime: audioRef.current.duration,
      });
    };
  }, [track]); // chạy lại mỗi khi track đổi, vì lúc đó audio element chắc chắn đã mount (do track && (<audio.../>))

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    songsData,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;