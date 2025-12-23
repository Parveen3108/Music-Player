import React, { useRef, useState, useEffect } from "react";
import {
  FaRandom,
  FaStop,
  FaPlay,
  FaVolumeDown,
  FaVolumeUp,
  FaRegHeart,
  FaPlus,
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { LuRepeat1 } from "react-icons/lu";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

export default function Home() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playMode, setPlayMode] = useState("shuffle");

  const songs = [
    {
      id: 1,
      name: "Bugee Datiye",
      title: "Laath Saab",
      photo: "/public/image/BuggeDatiye.webp",
      src: "../../public/songs/Bugee Datiye Laath Saab BigMoney Latest haryanvi song 2025.mp3",
    },
    {
      id: 2,
      name: "Chota Jamai",
      title: "Addi Kalyan",
      photo: "/public/image/Addi kalyan.jpg",
      src: "/public/songs/Chota Jamai - Addi Kalyan Manisha Rana Haryanvi songs 2025.mp3",
    },
    {
      id: 3,
      name: "FIRST LOVE",
      title: "Garry Sandhu",
      photo:"/public/image/First love garry shandhu.webp",
      src: "/public/songs/FIRST LOVE - Garry Sandhu (Official Visualizer).mp3",
    },
    {
      id: 4,
      name: "Velliyan Da Laana",
      title: "Gurjazz",
      photo:"/public/image/velliyan da laana.jpg",
      src: "/public/songs/Velliyan Da Laana - Gurjazz -Jashan Nanarh- Shehnaz gill 2019-Full-on music Records.mp3",
    },
    {
      id: 5,
      name: "Nek Munda",
      title: "Ij Bros Punjabi",
      photo:"/public/image/nek mhunda.jpg",
      src: "/public/songs/Nek Munda Vivi Verma, Fateh Meet Gill (Full Lyrical Song) Ij Bros Latest Punjabi Songs.mp3",
    },
  ];

  const togglePlay = () => {
    if (!audioRef.current) return; // safety check

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Audio play error:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const HendleNext = () => setIndex((prev) => (prev + 1) % songs.length);
  const HendlePrev = () =>
    setIndex((prev) => (prev - 1 + songs.length) % songs.length);

  const handleSongEnd = () => {
    if (playMode === "repeat-one") audioRef.current.play();
    else if (playMode === "shuffle") {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === index);
      setIndex(randomIndex);
    } else if (playMode === "repeat-all") HendleNext();
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.play();
  }, [index]);

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col-reverse md:flex-row justify-center items-start py-10 px-4 text-white gap-6">
      {/* ---------- Playlist Sidebar ---------- */}
      <div className="w-72 lg:w-80 bg-white/10 backdrop-blur-md rounded-xl p-4 h-[520px] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-green-500">
          🎵 Playlist
        </h3>
        <div className="flex items-center gap-3 mb-5 cursor-pointer">
          {playMode === "shuffle" && (
            <FaRandom onClick={() => setPlayMode("repeat-one")} />
          )}
          {playMode === "repeat-one" && (
            <LuRepeat1 onClick={() => setPlayMode("repeat-all")} />
          )}
          {playMode === "repeat-all" && (
            <FaRepeat onClick={() => setPlayMode("shuffle")} />
          )}
          <span className="text-sm text-gray-400 ml-2">Play Mode</span>
        </div>

        {songs.map((song, i) => (
          <div
            key={song.id}
            onClick={() => setIndex(i)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition text-xl
              ${
                i === index
                  ? "bg-green-500/20 text-green-400"
                  : "hover:bg-white/10"
              }`}
          >
            <span className="w-6 text-sm">{i + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{song.name}</p>
              <p className="text-xs text-gray-400 truncate">{song.title}</p>
            </div>
            {i === index && isPlaying && <span>▶</span>}
          </div>
        ))}
      </div>

      {/* ---------- Main Player ---------- */}
      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col items-center">
        <h2 className="text-xl text-gray-300 mb-3">Now Playing</h2>

        {/* Album Art */}
        <img
          src={songs[index].photo}
          alt="cover"
        className="w-100 h-64 rounded-xl object-cover shadow-lg mb-5"

        />

        {/* Song Info */}
        <h3 className="text-lg font-semibold">{songs[index].name}</h3>
        <p className="text-sm text-gray-400 mb-4">{songs[index].title}</p>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => {
              const seek = (e.target.value / 100) * duration;
              audioRef.current.currentTime = seek;
              setProgress(e.target.value);
            }}
            className="w-full"
            style={{ accentColor: "#22c55e" }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 mt-4">
          <TbPlayerTrackPrevFilled
            onClick={HendlePrev}
            className="text-2xl cursor-pointer hover:text-green-500"
          />
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center"
          >
            {isPlaying ? <FaStop /> : <FaPlay className="ml-1" />}
          </button>
          <TbPlayerTrackNextFilled
            onClick={HendleNext}
            className="text-2xl cursor-pointer hover:text-green-500"
          />
        </div>

        {/* Volume */}
        <div className="flex items-center gap-4 mt-5">
          <FaVolumeDown />
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            onChange={(e) => (audioRef.current.volume = e.target.value)}
            className="w-40"
            style={{ accentColor: "#22c55e" }}
          />
          <FaVolumeUp />
        </div>

        {/* Audio Tag */}
        <audio
          ref={audioRef}
          src={songs[index].src}
          onTimeUpdate={() => {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration || 0;
            setCurrentTime(current);
            setDuration(total);
            setProgress((current / total) * 100);
          }}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
          onEnded={handleSongEnd}
        />
      </div>
    </div>
  );
}
