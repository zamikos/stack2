import React, { useEffect, useRef, useState } from 'react';

// Internal SVG Icon to replace lucide-react dependency
const CameraIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
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
        
        <div className="mt-3 md:mt-4 font-permanent-marker text-[#b2693f] text-center">
          <p className="text-lg md:text-xl leading-tight mb-1">
            {caption}
          </p>
          <div className="mt-2 md:mt-3 border-t border-[#B76E79]/20 pt-2">
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
  return (
    <div className="relative w-full overflow-hidden py-10 bg-transparent border-y border-[#B76E79]/20">
      <div className="flex items-center">
        <div 
          className="flex animate-scroll whitespace-nowrap"
          style={{ animation: `scroll ${speed}s linear infinite`, width: 'max-content' }}
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
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#F2DEE3] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#F2DEE3] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

// --- Native ScrollReveal Component ---
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
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full">
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

// --- Countdown Section Component ---
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

  // --- Confetti Logic ---
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
      if (progress > 0.85) {
        emissionChance = 0.35 * (1 - ((progress - 0.85) / 0.15));
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

  // --- Scroll Logic ---
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

  // --- Timer Logic ---
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
  } else if (scrollProgress < 0.85) {
    currentAlpha = 1;
  } else {
    currentAlpha = Math.max(0.05, 1 - ((scrollProgress - 0.85) / 0.15) * 0.95);
  }
  const textColor = `rgba(178, 105, 63, ${currentAlpha})`;

  return (
    <section id="countdown" ref={sectionRef} className="relative w-full h-[350vh] bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] border-t border-[#B76E79]/20">
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


export default function App() {
  const scrollContainerRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroCardRef = useRef(null);
  const heroImgRef = useRef(null);
  
  const galleryContainerRef = useRef(null);
  const polaroidRefs = useRef([]);

  const photos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Infancia', rotation: -4 },
    { id: 2, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Familia', rotation: 3 },
    { id: 3, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Quince', rotation: -2 },
    { id: 4, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', caption: 'Aventuras', rotation: 4 },
    { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', caption: 'El Futuro', rotation: -5 }
  ];

  const timelinePhotos = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', caption: 'Primeros Pasos', date: 'ABR 2010', rotation: -2 },
    { id: 2, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', caption: 'Primer Día', date: 'SEP 2014', rotation: 3 },
    { id: 3, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800', caption: 'Décimo Cumpleaños', date: 'ABR 2020', rotation: -1.5 },
    { id: 4, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800', caption: 'Secundaria', date: 'AGO 2022', rotation: 2.5 },
    { id: 5, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', caption: 'Mis Quince', date: 'OCT 2025', rotation: -3 }
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

      const targetScale = isDesktop ? 0.45 : 0.80;
      const cardScale = 1.0 - ((1.0 - targetScale) * easeOut); 
      const borderRadius = isDesktop ? (24 + (32 * easeOut)) : (16 + (16 * easeOut));
      
      const imgScale = 1 + (0.15 * easeOut); 

      const textScale = 1 - (0.15 * easeOut);
      const textTranslateY = 0;

      heroTextRef.current.style.transform = `translateY(${textTranslateY}vh) scale(${textScale})`;
      heroCardRef.current.style.transform = `scale(${cardScale})`;
      heroCardRef.current.style.borderRadius = `${borderRadius}px`;
      heroImgRef.current.style.transform = `scale(${imgScale})`;

      if (galleryContainerRef.current) {
        const galContainer = galleryContainerRef.current;
        const galRect = galContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const totalHeight = galContainer.offsetHeight - windowHeight;
        let galProgress = -galRect.top / totalHeight;
        galProgress = Math.min(Math.max(galProgress, 0), 1);

        polaroidRefs.current.forEach((ref, index) => {
          if (!ref) return;

          const startThreshold = index / photos.length;
          let cardProgress = 0;
          
          if (galProgress > startThreshold) {
            cardProgress = (galProgress - startThreshold) / (1 / photos.length);
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

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=Permanent+Marker&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

          html {
            scroll-behavior: smooth;
          }
          
          body {
            font-family: 'Inter', sans-serif;
            background-color: #F5E6D3;
            color: #b2693f;
          }

          h1, h2, h3 {
            font-family: 'Playfair Display', serif;
          }

          .font-playfair {
            font-family: 'Playfair Display', serif !important;
          }

          .font-cursive-elegant {
            font-family: 'Pinyon Script', cursive !important;
          }
          
          .font-permanent-marker {
            font-family: 'Permanent Marker', cursive !important;
          }

          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #FDFBF7;
          }
          ::-webkit-scrollbar-thumb {
            background: #B76E79;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #D4AF37;
          }
          
          ::selection {
            background-color: rgba(183, 110, 121, 0.3);
          }

          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="antialiased">
        {/* Floating Rounded Navbar */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:gap-10 px-6 py-1.5 bg-[#FDFBF7]/80 backdrop-blur-md border border-[#B76E79]/30 rounded-full shadow-lg overflow-x-auto max-w-[90vw] whitespace-nowrap">
          <a href="#home" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Inicio</a>
          <a href="#details" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Detalles</a>
          <a href="#gallery" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Galería</a>
          <a href="#mensaje" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Mensaje</a>
          <a href="#countdown" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Conteo</a>
          <a href="#timeline" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">Historia</a>
          <a href="#rsvp" className="font-playfair text-xs md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] transition-colors tracking-wider">RSVP</a>
        </nav>

        {/* Hero Section */}
        <div id="home" ref={scrollContainerRef} className="relative w-full h-[250vh]">
          <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD]">
            <div ref={heroCardRef} className="absolute z-0 w-[94vw] h-[94vh] md:w-[96vw] md:h-[96vh] origin-center overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(183,110,121,0.3)] will-change-transform border border-[#B76E79]/20">
              <img ref={heroImgRef}
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                alt="Sofia XV Cinematic" 
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-[#FDFBF7]/30 backdrop-blur-[1px]"></div>
            </div>

            <div ref={heroTextRef} className="relative z-10 flex flex-col items-center text-center px-4 md:px-12 will-change-transform origin-center pointer-events-none">
              <p className="text-sm md:text-base lg:text-lg tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#b2693f]/90 mb-4 text-balance drop-shadow-sm">
                Acompáñanos a celebrar los XV años de
              </p>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-cursive-elegant font-normal text-[#b2693f] leading-tight drop-shadow-md">
                Sofía Becerra Martínez
              </h1>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <section id="details" className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] min-h-screen flex flex-col justify-center py-16 px-6 border-t border-[#B76E79]/20">
          <div className="max-w-4xl mx-auto text-center w-full">
            <h2 className="text-3xl md:text-5xl mb-4 md:mb-6 font-light text-[#b2693f]">Una Noche para Recordar</h2>
            <p className="text-base md:text-lg text-[#b2693f]/80 leading-relaxed mb-8 md:mb-10">
              Acompáñanos a una velada inolvidable de elegancia, música y celebración mientras Sofía entra en un nuevo capítulo de su vida. Estamos emocionados de compartir este hermoso hito con nuestros familiares y amigos más cercanos.
            </p>
            
            <div className="relative w-full h-48 md:h-[35vh] max-h-80 rounded-2xl md:rounded-3xl overflow-hidden border border-[#B76E79]/30 mb-8 md:mb-10 shadow-[0_15px_40px_rgba(183,110,121,0.2)] group">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Grand Plaza Estate Venue" 
                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
              <div className="p-5 md:p-6 border border-[#B76E79]/30 rounded-2xl bg-[#FDFBF7]/80 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/50 duration-300">
                <h3 className="text-lg md:text-xl font-serif mb-1 md:mb-2 text-[#b2693f]">La Fecha</h3>
                <p className="text-sm md:text-base text-[#b2693f]/80">Sábado, 1 de Agosto<br />A partir de las 7:00 PM</p>
              </div>
              <div className="p-5 md:p-6 border border-[#B76E79]/30 rounded-2xl bg-[#FDFBF7]/80 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/50 duration-300">
                <h3 className="text-lg md:text-xl font-serif mb-1 md:mb-2 text-[#b2693f]">El Lugar</h3>
                <p className="text-sm md:text-base text-[#b2693f]/80">Grand Plaza Estate<br />123 Crystal Avenue</p>
              </div>
              <div className="p-5 md:p-6 border border-[#B76E79]/30 rounded-2xl bg-[#FDFBF7]/80 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/50 duration-300">
                <h3 className="text-lg md:text-xl font-serif mb-1 md:mb-2 text-[#b2693f]">Código de Vestimenta</h3>
                <p className="text-sm md:text-base text-[#b2693f]/80">Formal / Etiqueta Opcional<br />Elegancia Cinematográfica</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section 
          id="gallery" 
          ref={galleryContainerRef}
          className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] border-t border-[#B76E79]/20" 
          style={{ height: `${photos.length * 100}vh` }}
        >
          <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            <h2 className="absolute top-20 md:top-32 text-4xl md:text-5xl font-light text-[#b2693f] z-0">Recuerdos</h2>

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
        <section id="mensaje" className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] border-t border-[#B76E79]/20">
          <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
            <ScrollReveal 
              text="A lo largo de estos quince años, he aprendido que la magia de la vida reside en los momentos compartidos. Gracias por ser parte de mi historia, por su amor incondicional, y por acompañarme a celebrar esta noche tan especial y verdaderamente inolvidable."
              scrollHeight="350vh"
              colorStart="rgba(178, 105, 63, 0.15)"
              colorEnd="#b2693f"
              className="font-playfair text-xl md:text-3xl lg:text-4xl leading-relaxed md:leading-[1.6] tracking-tight"
            >
              <p className="text-[#b2693f]/70 text-xl md:text-3xl font-playfair italic">
                - Sofía
              </p>
            </ScrollReveal>
          </div>
        </section>

        <CountdownSection />

        {/* Timeline Section */}
        <section id="timeline" className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] pt-32 pb-20 border-t border-[#B76E79]/20 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#b2693f] mb-6">A Través de los Años</h2>
            <p className="text-lg md:text-xl text-[#b2693f]/80 max-w-2xl mx-auto leading-relaxed">
              Un viaje a través de nuestras capturas favoritas. Pasa el cursor sobre una foto para pausar y ver más de cerca.
            </p>
          </div>
          
          <InfiniteCarousel items={timelinePhotos} speed={50} />
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] py-32 px-6 border-t border-[#B76E79]/20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl mb-8 font-light text-[#b2693f]">Confirmar Asistencia</h2>
            <p className="text-[#b2693f]/80 mb-12">Por favor, haznos saber si puedes asistir antes del 1 de julio.</p>
            <form className="flex flex-col gap-6 text-left">
              <input type="text" placeholder="Nombre Completo" className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors" />
              <input type="email" placeholder="Correo Electrónico" className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors" />
              
              <div className="flex flex-col gap-2">
                <label htmlFor="guestCount" className="text-[#b2693f]/80 text-sm ml-2">Número Total de Invitados (incluyéndote a ti)</label>
                <input type="number" id="guestCount" min="1" placeholder="ej., 2" className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="guestNames" className="text-[#b2693f]/80 text-sm ml-2">Nombres de Invitados Adicionales</label>
                <textarea id="guestNames" rows="3" placeholder="Por favor, escribe los nombres de tus acompañantes..." className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-6 py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"></textarea>
              </div>

              <button type="button" className="w-full bg-[#B76E79] text-white font-semibold rounded-xl px-6 py-4 mt-2 hover:bg-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300">Confirmar</button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
