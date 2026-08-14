import { createContext, useEffect, useRef, useState } from "react";
import { getAllSongs, recordPlay } from "../services/songService";
import { addRecentlyPlayed } from "../utils/recentlyPlayed";

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
        // Bỏ setTrack(data[0]) — không tự phát khi load trang
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

  const clearTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setTrack(null);
    setPlayStatus(false);
    setTime({ currentTime: 0, totalTime: 0 });
  };

  const playWithId = async (id) => {
    const song = songsData.find((s) => s.id === id);
    if (!song) return;
    setTrack(song);
    setPlayStatus(true);
    addRecentlyPlayed(id);
    recordPlay(id);
  };

  const previous = async () => {
    const currentIndex = songsData.findIndex((s) => s.id === track?.id);
    if (currentIndex > 0) {
      setTrack(songsData[currentIndex - 1]);
      setPlayStatus(true);
      addRecentlyPlayed(songsData[currentIndex - 1].id);
    }
  };

  const next = async () => {
    const currentIndex = songsData.findIndex((s) => s.id === track?.id);
    if (currentIndex < songsData.length - 1) {
      setTrack(songsData[currentIndex + 1]);
      setPlayStatus(true);
      addRecentlyPlayed(songsData[currentIndex + 1].id);
    }
  };

  const seekSong = async (e) => {
    if (audioRef.current && seekBg.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current.duration;
    }
  };

  useEffect(() => {
    if (playStatus && audioRef.current && track) {
      audioRef.current.play();
    }
  }, [track]);

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
  }, [track]);

  const contextValue = {
    audioRef, seekBg, seekBar,
    track, setTrack,
    songsData,
    playStatus, setPlayStatus,
    time, setTime,
    play, pause, clearTrack,
    playWithId, previous, next, seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;