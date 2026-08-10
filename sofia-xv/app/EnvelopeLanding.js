'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudio } from './AudioProvider';

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
  const router = useRouter();
  const { startMusic } = useAudio();
  const [phase, setPhase] = useState('idle'); // idle | cracking | open | fading

  const handleSealClick = () => {
    if (phase !== 'idle') return;
    startMusic();
    setPhase('cracking');
    setTimeout(() => setPhase('open'),   400);   // flap starts opening
    setTimeout(() => setPhase('fading'), 900);   // short pause then begin gradual fade
    setTimeout(() => router.push('/celebration-us'), 2800); // navigate after fade completes
  };

  const isOpen   = phase === 'open' || phase === 'fading';
  const isFading = phase === 'fading';

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FEF8F2 0%, #FAEbE3 45%, #F4D8CF 100%)' }}
    >
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
        @keyframes sealGlow {
          0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.65); opacity: 0;   }
        }
        @keyframes tapArrow {
          0%, 100% { transform: translateY(0);   opacity: 0.6; }
          50%       { transform: translateY(5px); opacity: 1;   }
        }
      `}</style>

      {/* ── Title ── */}
      <div
        className="text-center mb-5 md:mb-7"
        style={{
          opacity:       isOpen ? 0 : 1,
          transition:    'opacity 0.5s ease',
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        <h1 className="font-cursive-elegant text-5xl md:text-6xl text-[#b2693f] leading-none mb-3">
          Mi Quinceañera
        </h1>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#D4AF37]/55" />
          <span className="text-[#D4AF37]/75 text-xs">✦</span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#D4AF37]/55" />
        </div>
        <p
          className="font-playfair text-sm md:text-base text-[#b2693f]/70 italic"
          style={{ animation: 'hintPulse 2.8s ease-in-out infinite' }}
        >
          Haz click para abrir mi invitación
        </p>
        <div style={{ animation: 'tapArrow 1.4s ease-in-out infinite', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="#b2693f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Envelope scene ── */}
      <div
        onClick={phase === 'idle' ? handleSealClick : undefined}
        style={{
          position:          'relative',
          width:             'min(560px, 92vw)',
          height:            'min(350px, 61vw)',
          minHeight:         '215px',
          perspective:       '1800px',
          perspectiveOrigin: '50% 15%',
          cursor:            phase === 'idle' ? 'pointer' : 'default',
          opacity:           isFading ? 0 : 1,
          transform:         isFading ? 'scale(1.07)' : 'scale(1)',
          transition:        'opacity 2.6s cubic-bezier(0.4,0,0.2,1), transform 2.6s cubic-bezier(0.4,0,0.2,1)',
        }}
      >


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

        {/* ── Seal glow ring ── */}
        {phase === 'idle' && (
          <div style={{
            position:     'absolute',
            top:          '47%',
            left:         '50%',
            width:        '82px',
            height:       '82px',
            borderRadius: '50%',
            border:       '2px solid rgba(183,110,121,0.65)',
            transform:    'translate(-50%, -50%)',
            animation:    'sealGlow 1.8s ease-out infinite',
            zIndex:       19,
            pointerEvents:'none',
          }} />
        )}

        {/* ── Wax seal ── */}
        {(phase === 'idle' || phase === 'cracking') && (
          <div
            style={{
              position:  'absolute',
              top:       '47%',
              left:      '50%',
              transform: 'translate(-50%, -50%)',
              zIndex:    20,
              animation: phase === 'cracking' ? 'sealBreak 0.4s ease forwards' : 'none',
            }}
          >
            <WaxSeal />
          </div>
        )}

      </div>

      {/* Full-page fade-out overlay */}
      <div style={{
        position:      'fixed',
        inset:         0,
        background:    'linear-gradient(160deg, #FEF8F2 0%, #FAEbE3 45%, #F4D8CF 100%)',
        zIndex:        100,
        opacity:       isFading ? 1 : 0,
        transition:    isFading ? 'opacity 1.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
        pointerEvents: 'none',
      }} />
    </main>
  );
}
