'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Pre-computed bumpy polygon for a realistic wax seal edge
// 20 points alternating between r=36 and r=30, centered at 38,38
const WAX_POINTS = [
  [74,38],[67.5,47.6],[67.1,59.2],[56.2,63.1],[49.1,72.2],
  [38,69],[26.9,72.2],[19.8,63.1],[8.9,59.2],[8.5,47.6],
  [2,38],[8.5,28.4],[8.9,16.8],[19.8,12.9],[26.9,3.8],
  [38,7],[49.1,3.8],[56.2,12.9],[67.1,16.8],[67.5,28.4],
].map(([x,y]) => `${x},${y}`).join(' ');

function WaxSeal() {
  return (
    <svg
      width="82" height="82" viewBox="0 0 76 76"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', filter: 'drop-shadow(0 6px 18px rgba(140,60,80,0.55))' }}
    >
      <defs>
        {/* Depth gradient — lighter toward top-left, darker toward bottom-right */}
        <radialGradient id="waxDepth" cx="38%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="#D4889A" />
          <stop offset="55%"  stopColor="#B76E79" />
          <stop offset="100%" stopColor="#7E4050" />
        </radialGradient>
        {/* Sheen — simulates wax surface gloss */}
        <radialGradient id="waxSheen" cx="36%" cy="28%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Wax body */}
      <polygon points={WAX_POINTS} fill="url(#waxDepth)" />
      {/* Gloss sheen */}
      <polygon points={WAX_POINTS} fill="url(#waxSheen)" />
      {/* Outer gold ring */}
      <circle cx="38" cy="38" r="27" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="0.9" />
      {/* Inner dashed ring */}
      <circle cx="38" cy="38" r="24" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="0.6" strokeDasharray="2 1.8" />

      {/* Monogram */}
      <text x="38" y="35.5" textAnchor="middle" fontSize="12.5" fill="#FDFBF7"
        fontFamily="Playfair Display, serif" fontStyle="italic">Sofía</text>
      <text x="38" y="46.5" textAnchor="middle" fontSize="8" fill="rgba(253,251,247,0.72)"
        fontFamily="serif" letterSpacing="3.5">XV</text>

      {/* Cardinal gold dots */}
      <circle cx="38" cy="11" r="2"   fill="rgba(212,175,55,0.8)" />
      <circle cx="38" cy="65" r="2"   fill="rgba(212,175,55,0.8)" />
      <circle cx="11" cy="38" r="2"   fill="rgba(212,175,55,0.8)" />
      <circle cx="65" cy="38" r="2"   fill="rgba(212,175,55,0.8)" />
    </svg>
  );
}

export default function EnvelopeLanding() {
  const router   = useRouter();
  const audioRef = useRef(null);
  const [phase, setPhase]         = useState('idle'); // idle | cracking | open | fading
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSealClick = () => {
    if (phase !== 'idle') return;

    // Start music the moment the seal is clicked
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    setPhase('cracking');
    setTimeout(() => setPhase('open'),   400);   // flap starts opening
    setTimeout(() => setPhase('fading'), 1500);  // brief pause after flap fully open → fade out
    setTimeout(() => router.push('/celebration'), 2400); // navigate after fade completes
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else           { audio.play();  setIsPlaying(true);  }
  };

  const isOpen   = phase === 'open' || phase === 'fading';
  const isFading = phase === 'fading';

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FEF8F2 0%, #FAEbE3 45%, #F4D8CF 100%)' }}
    >
      {/* Place your MP3 at: public/music/song.mp3 */}
      <audio ref={audioRef} src="/music/song.mp3" loop preload="auto" />

      <style>{`
        @keyframes sealBreak {
          0%   { transform: translate(-50%,-50%) scale(1)    rotate(0deg);  opacity: 1; }
          40%  { transform: translate(-50%,-50%) scale(1.14) rotate(-5deg); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(0)    rotate(16deg); opacity: 0; }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1;   }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      {/* Floating music button */}
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

      {/* ── Title ── */}
      <div
        className="text-center mb-10 md:mb-14"
        style={{
          opacity:       isOpen ? 0 : 1,
          transition:    'opacity 0.5s ease',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        <p className="text-[10px] md:text-xs tracking-[0.55em] uppercase text-[#b2693f]/50 mb-4 font-sans">
          Una celebración especial
        </p>
        <h1 className="font-cursive-elegant text-7xl md:text-8xl text-[#b2693f] leading-none mb-5">
          Mi Quinceañera
        </h1>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]/55" />
          <span className="text-[#D4AF37]/75 text-sm">✦</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]/55" />
        </div>
        <p
          className="font-playfair text-base md:text-lg text-[#b2693f]/70 italic"
          style={{ animation: 'hintPulse 2.8s ease-in-out infinite' }}
        >
          Haz clic para abrir mi invitación
        </p>
      </div>

      {/* ── Envelope scene ── */}
      <div style={{
        position:          'relative',
        width:             'min(560px, 92vw)',
        height:            'min(350px, 61vw)',
        minHeight:         '215px',
        perspective:       '1800px',
        perspectiveOrigin: '50% 15%',
      }}>


        {/* ── Envelope body ── */}
        <div style={{
          position:     'absolute',
          inset:        0,
          zIndex:       10,
          overflow:     'hidden',
          borderRadius: '3px',
          background:   'linear-gradient(175deg, #FAF0E8 0%, #F5E4D2 50%, #EFD8C2 100%)',
          border:       '1px solid rgba(183,110,121,0.28)',
          boxShadow:    [
            '0 28px 70px rgba(140,70,60,0.22)',
            '0 8px 24px rgba(183,110,121,0.14)',
            'inset 0 1px 0 rgba(255,255,255,0.7)',
            'inset 0 -1px 0 rgba(140,70,60,0.08)',
          ].join(', '),
        }}>
          {/* Paper center highlight */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 52%, rgba(255,255,255,0.55) 0%, transparent 58%)',
          }} />
          {/* Left crease triangle */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
            background: 'linear-gradient(to bottom right, rgba(150,85,60,0.09) 49.5%, transparent 50%)',
          }} />
          {/* Right crease triangle */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%',
            background: 'linear-gradient(to bottom left, rgba(150,85,60,0.09) 49.5%, transparent 50%)',
          }} />
          {/* Bottom crease triangle */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(to top right, rgba(150,85,60,0.07) 49.5%, transparent 50%)',
          }} />
          {/* Subtle paper grain overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(150,85,60,0.015) 2px, rgba(150,85,60,0.015) 4px)',
          }} />
        </div>

        {/* ── Envelope flap — 3D rotation ── */}
        <div style={{
          position:        'absolute',
          top:             -1, left: -1, right: -1,
          height:          '52%',
          transformOrigin: 'top center',
          transform:       isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
          transition:      'transform 0.95s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle:  'preserve-3d',
          zIndex:          15,
        }}>
          {/* Front face — outside of the flap */}
          <div style={{
            position:          'absolute', inset: 0,
            clipPath:          'polygon(0 0, 100% 0, 50% 100%)',
            background:        'linear-gradient(175deg, #FAF0E8 0%, #ECDCC8 55%, #E2CDB8 100%)',
            border:            '1px solid rgba(183,110,121,0.22)',
            backfaceVisibility:'hidden',
            boxShadow:         'inset 0 -4px 12px rgba(140,70,60,0.12)',
          }} />
          {/* Back face — inside of the flap (warm rose, like the envelope lining) */}
          <div style={{
            position:          'absolute', inset: 0,
            clipPath:          'polygon(0 0, 100% 0, 50% 100%)',
            background:        'linear-gradient(175deg, #F5DDE8 0%, #ECC8D5 55%, #E0B8C8 100%)',
            backfaceVisibility:'hidden',
            transform:         'rotateX(180deg)',
          }} />
        </div>

        {/* ── Wax seal ── */}
        {(phase === 'idle' || phase === 'cracking') && (
          <div
            onClick={phase === 'idle' ? handleSealClick : undefined}
            style={{
              position:  'absolute',
              top:       '47%',
              left:      '50%',
              transform: 'translate(-50%, -50%)',
              zIndex:    20,
              cursor:    phase === 'idle' ? 'pointer' : 'default',
              animation: phase === 'cracking' ? 'sealBreak 0.4s ease forwards' : 'none',
              transition: phase === 'idle' ? 'transform 0.2s ease' : 'none',
            }}
            onMouseEnter={e => { if (phase==='idle') e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.08)'; }}
            onMouseLeave={e => { if (phase==='idle') e.currentTarget.style.transform = 'translate(-50%,-50%)'; }}
          >
            <WaxSeal />
          </div>
        )}

      </div>

      {/* Full-page fade-out overlay — matches SofiaXV's opening background */}
      <div style={{
        position:      'fixed',
        inset:         0,
        background:    '#F5E6D3',
        zIndex:        100,
        opacity:       isFading ? 1 : 0,
        transition:    isFading ? 'opacity 0.9s ease' : 'none',
        pointerEvents: 'none',
      }} />
    </main>
  );
}
