'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from './AudioProvider';

// Internal SVG Icon
const CameraIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

const HomeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
);

const Butterfly = ({ className = '', rotate = 0, delay = 0, duration = 6 }) => (
  <div
    className={`absolute pointer-events-none select-none ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 32"
      className="w-full h-full"
      style={{ animation: `butterflyFloat ${duration}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      <path d="M24 13 C21 6 11 2 5 5 C0 8 1 16 7 18 C13 20 21 16 24 13Z" fill="#C4889A" />
      <path d="M24 13 C27 6 37 2 43 5 C48 8 47 16 41 18 C35 20 27 16 24 13Z" fill="#C4889A" />
      <path d="M24 16 C20 19 11 19 8 24 C6 28 9 31 14 29 C19 27 23 22 24 16Z" fill="#C4889A" />
      <path d="M24 16 C28 19 37 19 40 24 C42 28 39 31 34 29 C29 27 25 22 24 16Z" fill="#C4889A" />
      <ellipse cx="24" cy="15" rx="1.5" ry="5.5" fill="#b2693f" opacity="0.55" />
      <path d="M23 10 Q18 5 16 3" stroke="#C4889A" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M25 10 Q30 5 32 3" stroke="#C4889A" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="3" r="1.2" fill="#C4889A" />
      <circle cx="32" cy="3" r="1.2" fill="#C4889A" />
    </svg>
  </div>
);

const Polaroid = ({ image, caption, date, rotation }) => {
  return (
    <div 
      className="flex-shrink-0 m-3 md:m-5 transition-transform duration-300 hover:scale-105 hover:z-10"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="bg-[#FDFBF7] p-2.5 pb-8 md:p-3 md:pb-10 shadow-[0_10px_30px_rgba(183,110,121,0.2)] border border-[#B76E79]/30 w-48 md:w-56">
        <div className="relative aspect-square overflow-hidden bg-[#F5E6D3]">
          <img
            src={image}
            alt={caption}
            className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute top-2 right-2 opacity-60">
            <CameraIcon className="text-[#D4AF37] drop-shadow-sm w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>

        <div className="mt-3 md:mt-4 font-playfair text-[#b2693f] text-center">
          <p className="text-lg md:text-xl leading-tight mb-1">
            {caption}
          </p>
          <div className="mt-2 md:mt-3 pt-2">
            <span className="text-[9px] md:text-[10px] text-[#b2693f]/70 font-mono uppercase tracking-widest font-sans">
              {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfiniteCarousel = ({ items, speed = 40 }) => {
  const extendedItems = [...items, ...items, ...items];
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastTimestampRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const getSetWidth = () => track.scrollWidth / 3;

    const animate = (timestamp) => {
      if (!isDraggingRef.current) {
        if (lastTimestampRef.current !== null) {
          const delta = timestamp - lastTimestampRef.current;
          const setWidth = getSetWidth();
          offsetRef.current += (setWidth / (speed * 1000)) * delta;
          if (offsetRef.current >= setWidth) offsetRef.current -= setWidth;
          if (offsetRef.current < 0) offsetRef.current += setWidth;
        }
        lastTimestampRef.current = timestamp;
      } else {
        lastTimestampRef.current = null;
      }
      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed]);

  const onDragStart = (clientX) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartOffsetRef.current = offsetRef.current;
  };

  const onDragMove = (clientX) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const setWidth = trackRef.current.scrollWidth / 3;
    let newOffset = dragStartOffsetRef.current + (dragStartXRef.current - clientX);
    newOffset = ((newOffset % setWidth) + setWidth) % setWidth;
    offsetRef.current = newOffset;
  };

  const onDragEnd = () => { isDraggingRef.current = false; };

  return (
    <div
      className="relative w-full overflow-hidden py-10 bg-transparent border-y border-[#B76E79]/20"
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      <div className="flex items-center">
        <div
          ref={trackRef}
          className="flex whitespace-nowrap cursor-grab active:cursor-grabbing select-none"
          style={{ width: 'max-content', touchAction: 'none' }}
          onMouseDown={(e) => onDragStart(e.clientX)}
          onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
          onTouchEnd={onDragEnd}
        >
          {extendedItems.map((item, index) => (
            <Polaroid
              key={`${item.id}-${index}`}
              image={item.image}
              caption={item.caption}
              date={item.date}
              rotation={item.rotation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ScrollReveal ---
const Word = ({ children, progress, start, colorStart, colorEnd }) => {
  const isActive = progress > start;
  return (
    <span 
      className="relative mr-[0.3em] inline-block transition-colors duration-1000 ease-out"
      style={{ color: isActive ? colorEnd : colorStart }}
    >
      {children}
    </span>
  );
};

const ScrollReveal = ({ 
  text = "", 
  colorStart = "rgba(178, 105, 63, 0.15)",
  colorEnd = "#b2693f",
  scrollHeight = "150vh",
  className = "",
  overlay,
  children
}) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScroll = containerRef.current.offsetHeight - windowHeight;
      let currentProgress = -rect.top / totalScroll;
      currentProgress = Math.max(0, Math.min(1, currentProgress));
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <div 
      ref={containerRef} 
      style={{ minHeight: scrollHeight }}
      className={`relative w-full ${className}`}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full relative">
        {overlay}
        <div className="flex flex-wrap justify-center text-center w-full">
          {words.map((word, i) => {
            const start = 0.1 + (i / words.length) * 0.5;
            return (
              <Word 
                key={i} 
                progress={progress} 
                start={start}
                colorStart={colorStart}
                colorEnd={colorEnd}
              >
                {word}
              </Word>
            );
          })}
        </div>
        
        {children && (
          <div 
            className="w-full flex justify-center mt-8 md:mt-12 transition-all duration-700 ease-out"
            style={{ 
              opacity: progress > 0.65 ? Math.min(1, (progress - 0.65) * 5) : 0,
              transform: `translateY(${progress > 0.65 ? 0 : 20}px)`
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Countdown Section ---
const CountdownSection = ({ 
  targetDate = "August 1, 2026 19:00:00",
  invitationText = "Por favor, acompáñanos a celebrar este momento inolvidable.",
  eventDateText = "1 de agosto, 2026"
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const targetTime = new Date(targetDate).getTime();

  // Confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor(side) {
        this.side = side;
        this.x = side === 'left' ? 0 : canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 5 + 3;
        this.speedX = side === 'left' ? Math.random() * 3 + 1 : -(Math.random() * 3 + 1);
        this.speedY = -(Math.random() * 6 + 5); 
        this.gravity = 0.06; 
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2; 
        const cinematicColors = [
          'rgba(183, 110, 121, 0.8)',
          'rgba(245, 230, 211, 0.8)',
          'rgba(253, 251, 247, 0.8)',
          'rgba(212, 175, 55, 0.8)'
        ];
        this.color = cinematicColors[Math.floor(Math.random() * cinematicColors.length)];
        this.opacity = 1;
      }

      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.0025; 
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 1.5, this.size, this.size * 1.2);
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = scrollProgressRef.current;
      
      let emissionChance = 0.35;
      if (progress > 0.9) {
        emissionChance = 0.35 * (1 - ((progress - 0.9) / 0.1));
      }

      if (progress > 0.01 && progress < 0.99) {
        if (Math.random() < Math.max(0, emissionChance)) {
          for(let i = 0; i < 3; i++) {
            particles.push(new Particle('left'));
            particles.push(new Particle('right'));
          }
        }
      }

      particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalHeight = sectionRef.current.offsetHeight - window.innerHeight;
      let progress = -rect.top / totalHeight;
      progress = Math.max(0, Math.min(progress, 1));
      setScrollProgress(progress);
      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  let currentAlpha = 0;
  if (scrollProgress < 0.2) {
    currentAlpha = 0.05 + (scrollProgress / 0.2) * 0.95; 
  } else if (scrollProgress < 0.9) {
    currentAlpha = 1;
  } else {
    currentAlpha = Math.max(0.05, 1 - ((scrollProgress - 0.9) / 0.1) * 0.95);
  }
  const textColor = `rgba(178, 105, 63, ${currentAlpha})`;

  return (
    <section id="countdown" ref={sectionRef} className="relative w-full h-[250vh] bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        
        <canvas ref={canvasRef} className="absolute inset-0 z-50" />

        <div 
          className="max-w-4xl mt-16 md:mt-20 transition-colors duration-200 ease-out flex flex-col items-center z-10 pointer-events-auto px-6 text-center" 
          style={{ color: textColor }}
        >
          <p className="text-base md:text-lg font-light italic mb-6 tracking-wide font-playfair">
            {invitationText}
          </p>
          
          <div className="mb-12 md:mb-16">
            <span className="text-4xl md:text-6xl lg:text-8xl font-light tracking-tighter block font-playfair">
              {eventDateText}
            </span>
          </div>

          <div className="flex gap-4 md:gap-12 justify-center">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Segs', value: timeLeft.seconds }
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center w-14 md:w-20">
                <span className="text-3xl md:text-5xl font-light">{item.value.toString().padStart(2, '0')}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2 font-sans opacity-70">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};


export default function SofiaXV() {
  const scrollContainerRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroImgRef = useRef(null);
  const navbarRef = useRef(null);
  const mobileNavRef = useRef(null);

  const galleryContainerRef = useRef(null);
  const polaroidRefs = useRef([]);

  const { isPlaying, toggleMusic } = useAudio();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollTimerRef = useRef(null);

  const [rsvpData, setRsvpData] = useState({
    name: '',
    attending: '',
    additionalNames: ''
  });
  const [formError, setFormError] = useState('');

  const photos = [
    { id: 1, url: '/images/stacked-polaroids/grass_sf.jpeg', caption: '', rotation: -4 },
    { id: 2, url: '/images/stacked-polaroids/beach_sf.jpeg', caption: '', rotation: 3 },
    { id: 3, url: '/images/stacked-polaroids/forrest.jpeg', caption: '', rotation: -2 },
    { id: 4, url: '/images/stacked-polaroids/tree.jpeg', caption: '', rotation: 4 },
    { id: 5, url: '/images/stacked-polaroids/cdmx.jpg', caption: '', rotation: -5 },
    { id: 6, url: '/images/stacked-polaroids/grad.jpeg', caption: '', rotation: 2 },
  ];

  const timelinePhotos = [
    { id: 1,  image: '/images/timelinephotos/IMG_0627.JPG',  caption: '', date: '', rotation: -2   },
    { id: 2,  image: '/images/timelinephotos/IMG_0667.jpg',  caption: '', date: '', rotation: 3    },
    { id: 3,  image: '/images/timelinephotos/IMG_0672.JPG',  caption: '', date: '', rotation: -1.5 },
    { id: 4,  image: '/images/timelinephotos/IMG_0690.jpg',  caption: '', date: '', rotation: 2.5  },
    { id: 5,  image: '/images/timelinephotos/IMG_0706.jpg',  caption: '', date: '', rotation: -3   },
    { id: 6,  image: '/images/timelinephotos/IMG_0708.JPG',  caption: '', date: '', rotation: 1.5  },
    { id: 7,  image: '/images/timelinephotos/IMG_0713.jpg',  caption: '', date: '', rotation: -2.5 },
    { id: 8,  image: '/images/timelinephotos/IMG_0736.JPG',  caption: '', date: '', rotation: 4    },
    { id: 9,  image: '/images/timelinephotos/IMG_0968.JPG',  caption: '', date: '', rotation: -1   },
    { id: 10, image: '/images/timelinephotos/IMG_0971.JPG',  caption: '', date: '', rotation: 3    },
    { id: 11, image: '/images/timelinephotos/IMG_2638.JPG',  caption: '', date: '', rotation: -3.5 },
    { id: 12, image: '/images/timelinephotos/IMG_0984.JPG',  caption: '', date: '', rotation: 2    },
    { id: 13, image: '/images/timelinephotos/IMG_2640.JPG',  caption: '', date: '', rotation: -2   },
    { id: 14, image: '/images/timelinephotos/IMG_1507.JPG',  caption: '', date: '', rotation: 3.5  },
    { id: 15, image: '/images/timelinephotos/IMG_1827.jpg',  caption: '', date: '', rotation: -1.5 },
    { id: 16, image: '/images/timelinephotos/IMG_1852.jpg',  caption: '', date: '', rotation: 2.5  },
    { id: 17, image: '/images/timelinephotos/IMG_2639.JPG',  caption: '', date: '', rotation: -4   },
    { id: 18, image: '/images/timelinephotos/IMG_2531.jpg',  caption: '', date: '', rotation: 1    },
    { id: 19, image: '/images/timelinephotos/IMG_5340.JPG',  caption: '', date: '', rotation: -2.5 },
    { id: 20, image: '/images/timelinephotos/IMG_6722.JPG',  caption: '', date: '', rotation: 3    },
  ];

  useEffect(() => {
    const updateAnimation = () => {
      if (!scrollContainerRef.current || !heroTextRef.current || !heroCardRef.current || !heroImgRef.current) return;

      const scrollContainer = scrollContainerRef.current;
      const rect = scrollContainer.getBoundingClientRect();
      const scrollDistance = scrollContainer.offsetHeight - window.innerHeight;
      
      let progress = -rect.top / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const isDesktop = window.innerWidth >= 768;

      const targetScale = isDesktop ? 0.45 : 0.65;
      const cardScale = 1.0 - ((1.0 - targetScale) * easeOut); 
      const borderRadius = isDesktop ? (24 + (32 * easeOut)) : (16 + (16 * easeOut));
      const imgTranslateY = isDesktop ? -15 * easeOut : -5 * easeOut;
      
      const imgScale = 1 + (0.15 * easeOut); 

      const textScale = 0.45 + (0.55 * easeOut);
      
      heroCardRef.current.style.transform = `translateY(${imgTranslateY}vh) scale(${cardScale})`;
      heroCardRef.current.style.borderRadius = `${borderRadius}px`;
      heroImgRef.current.style.transform = `scale(${imgScale})`;
      heroTextRef.current.style.transform = `scale(${textScale})`;
      // Navbar visibility
      const showNav = window.scrollY > window.innerHeight * 2.5;
      if (navbarRef.current) {
        navbarRef.current.style.opacity = showNav ? '1' : '0';
        navbarRef.current.style.pointerEvents = showNav ? 'auto' : 'none';
        navbarRef.current.style.transform = `translate(-50%, ${showNav ? '0' : '-20px'})`;
      }
      if (mobileNavRef.current) {
        mobileNavRef.current.style.opacity = showNav ? '1' : '0';
        mobileNavRef.current.style.pointerEvents = showNav ? 'auto' : 'none';
        mobileNavRef.current.style.transform = `translateY(${showNav ? '0' : '-20px'})`;
      }

      // Gallery scroll stack
      if (galleryContainerRef.current) {
        const galContainer = galleryContainerRef.current;
        const galRect = galContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const totalHeight = galContainer.offsetHeight - windowHeight;
        let galProgress = -galRect.top / totalHeight;
        galProgress = Math.min(Math.max(galProgress, 0), 1);

        const animationProgress = Math.min(galProgress / 0.8, 1);

        polaroidRefs.current.forEach((ref, index) => {
          if (!ref) return;

          const startThreshold = index / photos.length;
          let cardProgress = 0;
          
          if (animationProgress > startThreshold) {
            cardProgress = (animationProgress - startThreshold) / (1 / photos.length);
          }
          cardProgress = Math.min(Math.max(cardProgress, 0), 1);

          const isFirst = index === 0;
          const opacity = isFirst ? 1 : cardProgress;
          
          const translateY = isFirst ? 0 : (1 - cardProgress) * (windowHeight * 0.8);
          const rotate = isFirst ? photos[index].rotation : ((1 - cardProgress) * 25) + photos[index].rotation;
          const scale = isFirst ? 1 : 0.85 + (cardProgress * 0.15);

          ref.style.opacity = opacity;
          ref.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
          ref.style.zIndex = index + 10;
        });
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateAnimation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);


  useEffect(() => {
    const isAtBottom = () => window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

    const resetTimer = () => {
      setShowScrollIndicator(false);
      clearTimeout(scrollTimerRef.current);
      if (!isAtBottom()) {
        scrollTimerRef.current = setTimeout(() => {
          if (!isAtBottom()) setShowScrollIndicator(true);
        }, 3000);
      }
    };

    window.addEventListener('scroll', resetTimer, { passive: true });
    resetTimer();
    return () => {
      window.removeEventListener('scroll', resetTimer);
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleAddressClick = (e) => {
    e.preventDefault();
    const lat = 22.1550011;
    const lng = -100.900421;
    const label = encodeURIComponent("Salón de Eventos Elegance");
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // Try Google Maps app first; fall back to Apple Maps if not installed.
      let opened = false;
      const onBlur = () => { opened = true; };
      window.addEventListener('blur', onBlur, { once: true });
      window.location.href = `comgooglemaps://?q=${lat},${lng}&zoom=17`;
      setTimeout(() => {
        window.removeEventListener('blur', onBlur);
        if (!opened) window.location.href = `maps://?ll=${lat},${lng}&q=${label}`;
      }, 500);
    } else {
      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
    }
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    const { name, attending, additionalNames } = rsvpData;

    if (!name.trim()) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!attending) {
      setFormError('Por favor indica si podrás asistir.');
      return;
    }
    if (!additionalNames.trim()) {
      setFormError('Por favor indica los nombres de tus acompañantes, o escribe "Ninguno".');
      return;
    }

    setFormError('');
    const phoneNumber = "17073963858";

    const message = attending === 'yes'
      ? `¡Hola! Me gustaría confirmar mi asistencia a los XV de Sofía.\n\n*Nombre:* ${name}\n*Asistiré:* Sí ✅\n*Acompañantes:* ${additionalNames}`
      : `¡Hola! Lamentablemente no podré asistir a los XV de Sofía.\n\n*Nombre:* ${name}\n*Asistiré:* No ❌\n*Acompañantes:* ${additionalNames}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ animation: 'pageFadeIn 0.8s ease both' }}>
      {/* Floating music toggle button */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#FDFBF7]/80 backdrop-blur-md border border-[#B76E79]/30 shadow-lg flex items-center justify-center text-[#b2693f] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
      >
        {isPlaying ? (
          /* Pause icon */
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          /* Music note icon */
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>

      <style>{`
        @keyframes butterflyFloat {
          0%, 100% { transform: translateY(0px); }
          40%       { transform: translateY(-10px); }
          70%       { transform: translateY(-5px); }
        }
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes swipeUp {
          0%   { transform: rotate(12deg) translateY(18px);  opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: rotate(12deg) translateY(-18px); opacity: 0; }
        }
        @keyframes swipeTrail {
          0%   { transform: rotate(12deg) translateY(18px);  opacity: 0;    }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.35; }
          100% { transform: rotate(12deg) translateY(-18px); opacity: 0;   }
        }
      `}</style>
      {/* Floating Navbar */}
      {/* Desktop pill */}
      <nav
        ref={navbarRef}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-8 px-8 py-2.5 bg-[#FDFBF7]/80 backdrop-blur-md border border-[#B76E79]/30 rounded-full shadow-lg transition-all duration-500 opacity-0 pointer-events-none"
        style={{ transform: 'translate(-50%, -20px)' }}
      >
        <a href="#home" className="text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors flex items-center"><HomeIcon className="w-4 h-4" /></a>
        <a href="#details" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Detalles</a>
        <a href="#gallery" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Galería</a>
        <a href="#mensaje" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Mensaje</a>
        <a href="#timeline" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Historia</a>
        <a href="#regalos" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Regalos</a>
        <a href="#rsvp" className="font-playfair text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">RSVP</a>
      </nav>

      {/* Mobile hamburger button */}
      <div
        ref={mobileNavRef}
        className="fixed top-5 right-5 z-50 md:hidden transition-all duration-500 opacity-0 pointer-events-none"
        style={{ transform: 'translateY(-20px)' }}
      >
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="w-11 h-11 rounded-full bg-[#FDFBF7]/85 backdrop-blur-md border border-[#B76E79]/30 shadow-lg flex flex-col items-center justify-center gap-[5px]"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[1.5px] bg-[#b2693f] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[#b2693f] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[#b2693f] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[#FDFBF7]/95 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          onClick={() => setMenuOpen(false)}
        >
          <a href="#home"    onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest flex items-center gap-2"><HomeIcon className="w-5 h-5" /> Inicio</a>
          <a href="#details" onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Detalles</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Galería</a>
          <a href="#mensaje"   onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Mensaje</a>
          <a href="#countdown" onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Conteo</a>
          <a href="#timeline"  onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Historia</a>
          <a href="#regalos" onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">Regalos</a>
          <a href="#rsvp"    onClick={() => setMenuOpen(false)} className="font-playfair text-2xl text-[#b2693f] hover:text-[#D4AF37] transition-colors tracking-widest">RSVP</a>
        </div>
      )}


      {/* Hero Section */}
      <div id="home" ref={scrollContainerRef} className="relative w-full h-[250vh]">
        <div className="sticky top-0 w-full h-screen flex overflow-hidden bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD]">
          
          {/* Image Container */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div ref={heroCardRef} className="relative w-[94vw] h-[94vh] md:w-[96vw] md:h-[96vh] origin-center overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(183,110,121,0.3)] will-change-transform border border-[#B76E79]/20 pointer-events-auto">
              <img ref={heroImgRef}
                src="/images/hero/sofia-hero.jpeg" 
                alt="Sofia Becerra Martínez - XV Celebration" 
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />
            </div>
          </div>

          {/* Text Container */}
          <div className="absolute inset-x-0 bottom-16 md:bottom-28 z-20 flex items-end justify-center pointer-events-none">
            <div ref={heroTextRef} className="flex flex-col items-center text-center px-4 md:px-12 will-change-transform origin-bottom w-full">
              <p className="text-sm md:text-base lg:text-lg tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#b2693f] mb-2 md:mb-4 text-balance drop-shadow-md">
                Acompáñanos a celebrar los XV años de
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-cursive-elegant font-normal text-[#b2693f] leading-tight drop-shadow-xl">
                Sofía Becerra Martínez
              </h1>
            </div>
          </div>

        </div>
      </div>

      {/* Presentacion Message Section */}
      <section className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] py-24 px-6 overflow-hidden">
        <Butterfly className="top-[7%] left-[4%] w-12 h-8 opacity-[0.38]" rotate={-15} delay={0} duration={7} />
        <Butterfly className="bottom-[10%] right-[5%] w-9 h-6 opacity-[0.35]" rotate={28} delay={2.5} duration={6} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#B76E79]/8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-[#B76E79]/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">

          {/* Elegant cross */}
          <div className="flex flex-col items-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 60" className="w-7 h-10 text-[#D4AF37]/70 fill-current drop-shadow-sm">
              <rect x="16" y="0"  width="8" height="60" rx="2" />
              <rect x="0"  y="16" width="40" height="8"  rx="2" />
            </svg>
            <div className="flex items-center gap-3 mt-5">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
              <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
            </div>
          </div>

          <p className="font-playfair text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.6] tracking-tight text-[#b2693f] italic">
            "Hay momentos inolvidables que se quedan en el corazón para siempre. Mis XV años marcan el comienzo de una nueva etapa en mi vida. Señor Jesús, creo en ti con todas las fuerzas de mi ser y por eso te ofrezco mi juventud, te pido que guíes mis pasos, mis acciones, decisiones y pensamientos."
          </p>

          <p className="text-[#b2693f]/70 text-xl md:text-3xl font-playfair italic mt-8">
            - Sofía
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

        </div>
      </section>

      {/* Bible Verse Section */}
      <section className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] py-24 px-6 overflow-hidden">
        <Butterfly className="top-[15%] left-[4%] w-10 h-7 opacity-[0.33]" rotate={-15} delay={0.5} duration={7} />
        <Butterfly className="bottom-[15%] right-[4%] w-9 h-6 opacity-[0.32]" rotate={20} delay={2} duration={8} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>
          <p className="text-[#b2693f] text-2xl md:text-3xl font-playfair italic leading-loose mb-4">
            "Lámpara es a mis pies tu palabra,<br />
            Y lumbrera a mi camino"
          </p>
          <p className="text-[#b2693f]/70 text-sm tracking-[0.4em] uppercase font-light">— Salmos 119:105</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>
        </div>
      </section>

      {/* Mis Padres Section */}
      <section className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] py-16 px-6 overflow-hidden">
        <Butterfly className="top-[18%] right-[6%] w-10 h-7 opacity-[0.34]" rotate={32} delay={1} duration={8} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#B76E79]/8 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-[#B76E79]/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37] tracking-[0.6em] text-base">✦ ✦ ✦</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-[#b2693f]/60 mb-2 font-sans">Con la bendición de Dios, el amor y apoyo de</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#b2693f] mb-10 font-playfair">Mis Padres</h2>

          <div className="flex flex-row items-center justify-center">

            <div className="relative p-6 md:p-8 border border-[#B76E79]/25 rounded-3xl bg-[#FDFBF7]/60 backdrop-blur-sm shadow-[0_8px_30px_rgba(183,110,121,0.12)] hover:shadow-[0_14px_40px_rgba(183,110,121,0.22)] hover:border-[#D4AF37]/40 transition-all duration-500 w-44 md:w-64">
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#D4AF37]/50 rounded-tl" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#D4AF37]/50 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#D4AF37]/50 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#D4AF37]/50 rounded-br" />
              <p className="font-playfair text-xl md:text-3xl text-[#b2693f] leading-snug">Samuel<br />Becerra</p>
            </div>

            <div className="flex flex-col items-center mx-5 md:mx-6 gap-2">
              <div className="w-px h-10 md:h-12 bg-gradient-to-b from-transparent via-[#B76E79]/30 to-transparent" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 fill-[#B76E79]/50 drop-shadow-sm">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
              <div className="w-px h-10 md:h-12 bg-gradient-to-b from-transparent via-[#B76E79]/30 to-transparent" />
            </div>

            <div className="relative p-6 md:p-8 border border-[#B76E79]/25 rounded-3xl bg-[#FDFBF7]/60 backdrop-blur-sm shadow-[0_8px_30px_rgba(183,110,121,0.12)] hover:shadow-[0_14px_40px_rgba(183,110,121,0.22)] hover:border-[#D4AF37]/40 transition-all duration-500 w-44 md:w-64">
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#D4AF37]/50 rounded-tl" />
              <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#D4AF37]/50 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#D4AF37]/50 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#D4AF37]/50 rounded-br" />
              <p className="font-playfair text-xl md:text-3xl text-[#b2693f] leading-snug">Lucina<br />Martínez</p>
            </div>

          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37] tracking-[0.6em] text-base">✦ ✦ ✦</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

        </div>
      </section>

      {/* Details Section */}
      <section id="details" className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] py-20 px-6 overflow-hidden">
        <Butterfly className="top-[10%] right-[3%] w-12 h-8 opacity-[0.35]" rotate={-22} delay={3} duration={7} />
        <Butterfly className="bottom-[3%] left-[48%] w-9 h-6 opacity-[0.34]" rotate={12} delay={1.5} duration={6.5} />
        <Butterfly className="top-[45%] right-[5%] w-10 h-7 opacity-[0.33]" rotate={-8} delay={0.8} duration={8} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[#B76E79]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-[#B76E79]/5 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center w-full relative z-10">
          <div className="relative w-full h-64 md:h-[50vh] max-h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border border-[#B76E79]/30 mb-10 shadow-[0_15px_40px_rgba(183,110,121,0.2)] group">
            <img
              src="/images/salon/salon.jpg"
              alt="Salón de Eventos Elegance"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#b2693f]/20 to-transparent" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>
          <h2 className="text-3xl md:text-5xl mb-4 font-light text-[#b2693f] font-playfair">Una Noche para Recordar</h2>
          <p className="text-base md:text-lg text-[#b2693f]/70 leading-relaxed mb-12 max-w-xl mx-auto">
            Te invitamos a compartir con nosotros una noche llena de magia, música y grandes recuerdos. Acompáñanos a celebrar los quince años de Sofía y a darle la bienvenida a esta hermosa nueva etapa de su vida.
          </p>

          {/* Detail rows */}
          <div className="text-left space-y-0">

            {/* La Fecha */}
            <div className="relative flex items-center gap-5 md:gap-8 py-8 border-b border-[#B76E79]/15 group/row">
              <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#b2693f] to-[#944f2c] flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(178,105,63,0.35)] group-hover/row:shadow-[0_8px_28px_rgba(178,105,63,0.45)] transition-shadow duration-300">
                <span className="text-[9px] tracking-[0.25em] text-white/60 uppercase font-sans">Ago</span>
                <span className="text-3xl md:text-4xl font-playfair text-white leading-none">1</span>
                <span className="text-[9px] tracking-[0.2em] text-white/60 uppercase font-sans">2025</span>
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-[10px] tracking-[0.45em] uppercase text-[#b2693f]/50 mb-1 font-sans">La Fecha</p>
                <p className="font-playfair text-xl md:text-3xl text-[#b2693f]">Sábado, 1 de Agosto</p>
                <p className="text-sm md:text-base text-[#b2693f]/65 mt-1">A partir de las 7:00 PM</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="relative flex items-center gap-5 md:gap-8 py-8 border-b border-[#B76E79]/15 group/row">
              <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-[#D4AF37]/40 bg-[#FDFBF7]/70 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(183,110,121,0.12)] group-hover/row:shadow-[0_6px_22px_rgba(183,110,121,0.2)] transition-shadow duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-[#b2693f]/70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-[10px] tracking-[0.45em] uppercase text-[#b2693f]/50 mb-1 font-sans">Ubicación</p>
                <p className="font-playfair text-xl md:text-3xl text-[#b2693f]">Salón de Eventos Elegance</p>
                <a
                  href="#"
                  onClick={handleAddressClick}
                  className="text-sm md:text-base text-[#b2693f]/60 hover:text-[#D4AF37] underline underline-offset-2 decoration-[#B76E79]/30 hover:decoration-[#D4AF37] transition-colors duration-200 cursor-pointer mt-1 block"
                >
                  Carr. RíoVerde km 246, Soledad de Graciano Sánchez, S.L.P.
                </a>
              </div>
            </div>

            {/* Código de Vestimenta */}
            <div className="relative flex items-center gap-5 md:gap-8 py-8 group/row">
              <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-[#D4AF37]/40 bg-[#FDFBF7]/70 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(183,110,121,0.12)] group-hover/row:shadow-[0_6px_22px_rgba(183,110,121,0.2)] transition-shadow duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-[#b2693f]/70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 2 Q12 4.5 15 2 L16.5 6.5 C17.5 7.5 18 9 18 10.5 L18 12 L6 12 L6 10.5 C6 9 6.5 7.5 7.5 6.5 Z" />
                  <path d="M6 12 L3 22 L21 22 L18 12 Z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-[10px] tracking-[0.45em] uppercase text-[#b2693f]/50 mb-1 font-sans">Código de Vestimenta</p>
                <p className="font-playfair text-xl md:text-3xl text-[#b2693f]">Formal</p>
                <p className="text-xs text-[#b2693f]/55 mt-2 italic">
                  Por favor evita el rosa dorado — es el color del vestido de la quinceañera.
                </p>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section 
        id="gallery" 
        ref={galleryContainerRef}
        className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3]"
        style={{ height: `${photos.length * 120}vh` }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <Butterfly className="top-[12%] left-[4%] w-11 h-7 opacity-[0.35]" rotate={-18} delay={1.5} duration={7} />
          <Butterfly className="bottom-[15%] right-[5%] w-10 h-7 opacity-[0.34]" rotate={20} delay={3.5} duration={8} />
          <Butterfly className="top-[20%] right-[7%] w-8 h-5 opacity-[0.33]" rotate={35} delay={0.5} duration={6.5} />
          <Butterfly className="bottom-[7%] left-[6%] w-9 h-6 opacity-[0.39]" rotate={-10} delay={2.5} duration={7.5} />

          <h2 className="absolute top-20 md:top-32 text-4xl md:text-5xl font-light text-[#b2693f] z-0">Galería</h2>

          <div className="relative w-[85vw] max-w-[320px] md:max-w-[400px] aspect-[4/5] mt-12 md:mt-20">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                ref={(el) => (polaroidRefs.current[index] = el)}
                className="absolute inset-0 origin-center will-change-transform"
                style={{
                  filter: `drop-shadow(0 20px 40px rgba(183,110,121,0.2))`
                }}
              >
                <div className="w-full h-full bg-[#FDFBF7] p-3 pb-12 md:p-5 md:pb-16 shadow-xl border border-[#B76E79]/30 flex flex-col">
                  <div className="relative flex-1 bg-[#F5E6D3] overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  
                  <p className="font-playfair text-[#b2693f] mt-4 md:mt-5 text-xl md:text-2xl text-center tracking-wide">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* Personal Message Section */}
      <section id="mensaje" className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
          <ScrollReveal
            text="Mis quince años marcan el comienzo de una nueva aventura, donde inicio un camino lleno de sueños y oportunidades. Dejo mi infancia en el pasado y continúo mi viaje para crear recuerdos increíbles junto a mis amigos y familia. He soñado con esta fiesta desde que era niña y me encantaría que me acompañes a celebrar esta noche tan especial y verdaderamente inolvidable."
            scrollHeight="250vh"
            colorStart="rgba(178, 105, 63, 0.15)"
            overlay={<Butterfly className="bottom-[4%] right-[5%] w-11 h-7 opacity-[0.35]" rotate={18} delay={1.5} duration={7} />}
            colorEnd="#b2693f"
            className="font-playfair text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.6] tracking-tight"
          >
            <p className="text-[#b2693f]/70 text-xl md:text-3xl font-playfair italic">
              - Sofía
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Countdown */}
      <CountdownSection />

      {/* Timeline Section */}
      <section id="timeline" className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] pt-16 pb-10 overflow-hidden">
        <Butterfly className="top-[18%] right-[3%] w-10 h-7 opacity-[0.33]" rotate={-28} delay={4} duration={7.5} />
        <Butterfly className="bottom-[12%] left-[4%] w-9 h-6 opacity-[0.34]" rotate={14} delay={2} duration={6.5} />
        <div className="max-w-6xl mx-auto text-center px-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#b2693f] mb-6">A Través de los Años</h2>
          <p className="text-lg md:text-xl text-[#b2693f]/80 max-w-2xl mx-auto leading-relaxed">
            Un viaje a través de mis capturas favoritas.
          </p>
        </div>
        
        <InfiniteCarousel items={timelinePhotos} speed={120} />
      </section>

      {/* Mesa de Regalos Section */}
      <section id="regalos" className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] py-20 px-6 overflow-hidden">
        <Butterfly className="top-[8%] left-[4%] w-11 h-7 opacity-[0.34]" rotate={-20} delay={1} duration={7} />
        <Butterfly className="bottom-[10%] right-[4%] w-9 h-6 opacity-[0.33]" rotate={25} delay={3} duration={8} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#B76E79]/6 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-[#B76E79]/8 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37] tracking-[0.6em] text-base">✦ ✦ ✦</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-[#b2693f]/60 mb-2 font-sans">Con cariño</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#b2693f] mb-8 font-playfair">Mesa de Regalos</h2>

          <p className="font-playfair text-lg md:text-xl text-[#b2693f]/80 italic leading-relaxed mb-12 max-w-2xl mx-auto">
            Mi mejor regalo es compartir contigo este gran día. Sin embargo, si deseas obsequiarme algo, puedo sugerirte las siguientes opciones:
          </p>

          {/* Lluvia de Sobres Card */}
          <div className="relative p-8 md:p-10 border border-[#B76E79]/25 rounded-3xl bg-[#FDFBF7]/60 backdrop-blur-sm shadow-[0_8px_30px_rgba(183,110,121,0.12)] hover:shadow-[0_14px_40px_rgba(183,110,121,0.22)] hover:border-[#D4AF37]/40 transition-all duration-500 max-w-xl mx-auto">
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#D4AF37]/50 rounded-tl" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#D4AF37]/50 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#D4AF37]/50 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#D4AF37]/50 rounded-br" />

            {/* Envelope icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-[#b2693f] to-[#944f2c] flex items-center justify-center shadow-[0_6px_20px_rgba(178,105,63,0.35)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <polyline points="2,5 12,13 22,5" />
                </svg>
              </div>
            </div>

            <h3 className="font-playfair text-2xl md:text-3xl text-[#b2693f] mb-4">¡Lluvia de Sobres!</h3>

            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
              <span className="text-[#D4AF37]/60 text-xs tracking-[0.4em]">✦</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
            </div>

            <p className="text-[#b2693f]/70 leading-relaxed text-base md:text-lg font-playfair">
              La lluvia de sobres es la tradición de regalar dinero en efectivo a la quinceañera en un sobre el día del evento.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-12">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <span className="text-[#D4AF37]/70 text-xs tracking-[0.5em]">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
          </div>

        </div>
      </section>


      {/* Scroll Indicator — bottom center */}
      <div
        className={`fixed bottom-7 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none transition-all duration-700 ${
          showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
        style={{
          position: 'fixed',
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(178,105,63,0.25)',
          borderRadius: '18px',
          padding: '20px 16px 16px',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="115 20 230 410"
          className="w-12 h-[86px] text-[#b2693f]"
          style={{ animation: 'swipeUp 1.6s cubic-bezier(0.4,0,0.2,1) infinite' }}
        >
          <g transform="translate(30, 0)">
            {/* Concentric ripple circles */}
            <circle cx="190" cy="125" r="32" fill="none" stroke="currentColor" strokeWidth="5"   opacity="1"/>
            <circle cx="190" cy="125" r="54" fill="none" stroke="currentColor" strokeWidth="4"   opacity="1"/>
            <circle cx="190" cy="125" r="76" fill="none" stroke="currentColor" strokeWidth="3"   opacity="0.8"/>
            <circle cx="190" cy="125" r="98" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.58"/>
            {/* Hand outline */}
            <path
              fill="white"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 178 420 C 155 380, 120 330, 115 285 C 112 255, 138 245, 148 275 C 154 295, 162 315, 172 315 L 172 125 A 18 18 0 0 1 208 125 L 208 205 A 17 17 0 0 1 242 205 L 242 225 A 16 16 0 0 1 274 225 L 274 250 A 15 15 0 0 1 304 250 C 304 310, 292 385, 278 420 Z"
            />
            {/* Finger creases */}
            <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.45" d="M 208 205 L 208 265"/>
            <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.45" d="M 242 225 L 242 270"/>
            <path fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.45" d="M 274 250 L 274 285"/>
          </g>
        </svg>
        {/* Swipe trail line — follows below the hand */}
        <div
          style={{
            width: '2px',
            height: '36px',
            borderRadius: '999px',
            background: 'linear-gradient(to bottom, rgba(178,105,63,0.8), transparent)',
            animation: 'swipeTrail 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
            transformOrigin: 'top center',
            marginTop: '-8px',
          }}
        />
        <span className="font-playfair text-xs tracking-[0.3em] uppercase text-[#b2693f] font-bold italic">
          Desliza
        </span>
      </div>

      {/* RSVP Section */}
      <section id="rsvp" className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] min-h-screen flex flex-col justify-center py-24 px-6 overflow-hidden">
        <Butterfly className="top-[10%] left-[5%] w-12 h-8 opacity-[0.36]" rotate={15} delay={1} duration={6.5} />
        <Butterfly className="bottom-[18%] right-[5%] w-9 h-6 opacity-[0.34]" rotate={-12} delay={3.5} duration={7.5} />
        <div className="max-w-xl mx-auto text-center w-full">
          <h2 className="text-4xl md:text-5xl mb-8 font-light text-[#b2693f]">Confirmar Asistencia</h2>
          <p className="text-[#b2693f]/80 mb-12">Por favor, haznos saber si puedes asistir antes del 1 de Julio.</p>
          
          <form onSubmit={handleWhatsAppSubmit} className="flex flex-col gap-6 text-left">
            <input
              type="text"
              required
              value={rsvpData.name}
              onChange={(e) => { setRsvpData({ ...rsvpData, name: e.target.value }); setFormError(''); }}
              placeholder="Nombre Completo"
              className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />

            {/* Attendance toggle */}
            <div className="flex flex-col gap-3">
              <p className="text-[#b2693f]/80 text-sm ml-2">¿Podrás asistir?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setRsvpData({ ...rsvpData, attending: 'yes' }); setFormError(''); }}
                  className={`py-4 px-4 rounded-xl border font-playfair text-base transition-all duration-300 ${
                    rsvpData.attending === 'yes'
                      ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-[0_4px_14px_rgba(183,110,121,0.4)]'
                      : 'bg-[#FDFBF7] border-[#B76E79]/40 text-[#b2693f] hover:border-[#B76E79] hover:bg-[#F5E6D3]'
                  }`}
                >
                  Sí asistiré ✓
                </button>
                <button
                  type="button"
                  onClick={() => { setRsvpData({ ...rsvpData, attending: 'no' }); setFormError(''); }}
                  className={`py-4 px-4 rounded-xl border font-playfair text-base transition-all duration-300 ${
                    rsvpData.attending === 'no'
                      ? 'bg-[#b2693f] border-[#b2693f] text-white shadow-[0_4px_14px_rgba(178,105,63,0.35)]'
                      : 'bg-[#FDFBF7] border-[#B76E79]/40 text-[#b2693f] hover:border-[#b2693f] hover:bg-[#F5E6D3]'
                  }`}
                >
                  No asistiré ✗
                </button>
              </div>
            </div>

<div className="flex flex-col gap-2">
              <label htmlFor="guestNames" className="text-[#b2693f]/80 text-sm ml-2">Nombres de Invitados Adicionales</label>
              <textarea
                id="guestNames"
                rows="3"
                required={rsvpData.attending === 'yes'}
                value={rsvpData.additionalNames}
                onChange={(e) => { setRsvpData({ ...rsvpData, additionalNames: e.target.value }); setFormError(''); }}
                placeholder="Escribe los nombres de tus acompañantes (o 'Ninguno' si asistes solo)..."
                className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              ></textarea>
            </div>

            {formError && (
              <p className="text-sm text-[#B76E79] text-center bg-[#B76E79]/10 border border-[#B76E79]/30 rounded-xl px-4 py-3">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={!rsvpData.attending}
              className="w-full bg-[#B76E79] text-white font-semibold rounded-xl px-6 py-4 mt-2 hover:bg-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#B76E79] disabled:hover:shadow-none"
            >
              Confirmar por WhatsApp
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
