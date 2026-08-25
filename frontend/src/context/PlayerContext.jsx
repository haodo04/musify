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
  const [queue, setQueue] = useState([]);
  const [time, setTime] = useState({
    currentTime: 0,
    totalTime: 0,
  });

  const [volume, setVolume] = useState(1);
  const previousVolumeRef = useRef(1);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs();
        setSongsData(data);
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

  const playWithId = async (id, songList = null) => {
    const list = Array.isArray(songList) && songList.length > 0 ? songList : songsData;
    const song = list.find((s) => s.id === id) || songsData.find((s) => s.id === id);
    if (!song) return;
    setQueue(list);
    setTrack(song);
    setPlayStatus(true);
    addRecentlyPlayed(id);
    recordPlay(id);
  };

  const previous = async () => {
    const activeQueue = queue.length > 0 ? queue : songsData;
    const currentIndex = activeQueue.findIndex((s) => s.id === track?.id);
    if (currentIndex > 0) {
      const prevSong = activeQueue[currentIndex - 1];
      setTrack(prevSong);
      setPlayStatus(true);
      addRecentlyPlayed(prevSong.id);
    }
  };

  const next = async () => {
    const activeQueue = queue.length > 0 ? queue : songsData;
    const currentIndex = activeQueue.findIndex((s) => s.id === track?.id);
    if (currentIndex !== -1 && currentIndex < activeQueue.length - 1) {
      const nextSong = activeQueue[currentIndex + 1];
      setTrack(nextSong);
      setPlayStatus(true);
      addRecentlyPlayed(nextSong.id);
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
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [track]);

  const changeVolume = (value) => {
    const clamped = Math.min(1, Math.max(0, value));
    setVolume(clamped);
    if (clamped > 0) {
      previousVolumeRef.current = clamped;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(previousVolumeRef.current || 1);
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
    queue,
    playStatus, setPlayStatus,
    time, setTime,
    volume, changeVolume, toggleMute,
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