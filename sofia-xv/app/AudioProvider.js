'use client';

import { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext({ isPlaying: false, startMusic: () => {}, toggleMusic: () => {} });
export const useAudio = () => useContext(AudioContext);

export default function AudioProvider({ children }) {
  const audioRef  = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { audio.play();  setIsPlaying(true);  }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, startMusic, toggleMusic }}>
      {/* Place your MP3 at: public/music/song.mp3 */}
      <audio ref={audioRef} src="/music/song.mp3" loop preload="auto" />

      {/* Floating music button — persists across pages */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#FDFBF7]/80 backdrop-blur-md border border-[#B76E79]/30 shadow-lg flex items-center justify-center text-[#b2693f] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>

      {children}
    </AudioContext.Provider>
  );
}
