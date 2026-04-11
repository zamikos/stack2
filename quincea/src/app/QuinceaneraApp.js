'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─── SVG Icon ─── */
const CameraIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

/* ─── Polaroid Card ─── */
const Polaroid = ({ image, caption, date, rotation }) => (
  <div
    className="flex-shrink-0 m-3 md:m-5 transition-transform duration-300 hover:scale-105 hover:z-10"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <div className="bg-[#FDFBF7] p-2.5 pb-8 md:p-3 md:pb-10 shadow-[0_10px_30px_rgba(183,110,121,0.2)] border border-[#B76E79]/30 w-44 md:w-56">
      <div className="relative aspect-square overflow-hidden bg-[#F5E6D3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={caption}
          className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 opacity-60">
          <CameraIcon className="text-[#D4AF37] drop-shadow-sm w-3 h-3 md:w-4 md:h-4" />
        </div>
      </div>
      <div className="mt-3 md:mt-4 font-permanent-marker text-[#b2693f] text-center">
        <p className="text-base md:text-xl leading-tight mb-1">{caption}</p>
        <div className="mt-2 md:mt-3 border-t border-[#B76E79]/20 pt-2">
          <span className="text-[9px] md:text-[10px] text-[#b2693f]/70 font-mono uppercase tracking-widest font-sans">
            {date}
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Infinite Carousel ─── */
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
            <Polaroid key={`${item.id}-${index}`}
              image={item.image} caption={item.caption}
              date={item.date} rotation={item.rotation}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-[#F0D5DD] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-[#F0D5DD] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

/* ─── Scroll Reveal Word ─── */
const Word = ({ children, progress, start, colorStart, colorEnd }) => {
  const isActive = progress > start;
  return (
    <span
      className="relative mr-[0.3em] inline-block transition-colors duration-700 ease-out"
      style={{ color: isActive ? colorEnd : colorStart }}
    >
      {children}
    </span>
  );
};

/* ─── Scroll Reveal Section ─── */
const ScrollReveal = ({
  text = '',
  colorStart = 'rgba(178, 105, 63, 0.15)',
  colorEnd = '#b2693f',
  scrollHeight = '150vh',
  stickyTop = '25vh',
  className = '',
}) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      let p = -rect.top / totalScroll;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = text.split(' ');

  return (
    <div ref={containerRef} style={{ minHeight: scrollHeight }} className={`relative w-full ${className}`}>
      <div className="sticky flex flex-wrap justify-center px-4" style={{ top: stickyTop }}>
        {words.map((word, i) => {
          const start = 0.15 + (i / words.length) * 0.7;
          return (
            <Word key={i} progress={progress} start={start}
              colorStart={colorStart} colorEnd={colorEnd}>
              {word}
            </Word>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Countdown Section ─── */
const CountdownSection = ({
  targetDate = 'August 1, 2026 19:00:00',
  invitationText = 'Por favor, acompáñanos a celebrar este momento inolvidable.',
  eventDateText = '1 de agosto, 2026',
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetTime = new Date(targetDate).getTime();

  /* Confetti */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    class Particle {
      constructor(side) {
        this.x = side === 'left' ? 0 : canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 5 + 3;
        this.speedX = side === 'left' ? Math.random() * 3 + 1 : -(Math.random() * 3 + 1);
        this.speedY = -(Math.random() * 6 + 5);
        this.gravity = 0.06;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
        const colors = [
          'rgba(183, 110, 121, 0.8)', 'rgba(245, 230, 211, 0.8)',
          'rgba(253, 251, 247, 0.8)', 'rgba(212, 175, 55, 0.8)',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
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
      if (scrollProgressRef.current > 0.01 && scrollProgressRef.current < 0.99) {
        if (Math.random() < 0.25) {
          for (let i = 0; i < 2; i++) {
            particles.push(new Particle('left'));
            particles.push(new Particle('right'));
          }
        }
      }
      particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  /* Scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      let p = -rect.top / total;
      p = Math.max(0, Math.min(p, 1));
      setScrollProgress(p);
      scrollProgressRef.current = p;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Timer */
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetTime - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const alpha = 0.05 + scrollProgress * 0.95;
  const textColor = `rgba(178, 105, 63, ${alpha})`;

  return (
    <section id="countdown" ref={sectionRef}
      className="relative w-full h-[200vh] bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] border-t border-[#B76E79]/20">
      <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 z-50" />
        <div className="max-w-4xl mt-10 md:mt-20 transition-colors duration-700 ease-out flex flex-col items-center z-10 pointer-events-auto px-6 text-center"
          style={{ color: textColor }}>
          <p className="text-sm md:text-lg font-light italic mb-4 md:mb-6 tracking-wide opacity-90 font-playfair">
            {invitationText}
          </p>
          <div className="mb-8 md:mb-16">
            <span className="text-3xl md:text-6xl lg:text-8xl font-light tracking-tighter block font-playfair">
              {eventDateText}
            </span>
          </div>
          <div className="flex gap-4 md:gap-12 justify-center">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Segs', value: timeLeft.seconds },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center w-14 md:w-20">
                <span className="text-2xl md:text-5xl font-light tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="text-[9px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.3em] mt-1 md:mt-2 font-sans opacity-70">
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

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function QuinceaneraApp() {
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
    { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', caption: 'El Futuro', rotation: -5 },
  ];

  const timelinePhotos = [
    { id: 1, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800', caption: 'Primeros Pasos', date: 'ABR 2010', rotation: -2 },
    { id: 2, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', caption: 'Primer Día', date: 'SEP 2014', rotation: 3 },
    { id: 3, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800', caption: 'Décimo Cumpleaños', date: 'ABR 2020', rotation: -1.5 },
    { id: 4, image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800', caption: 'Secundaria', date: 'AGO 2022', rotation: 2.5 },
    { id: 5, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', caption: 'Mis Quince', date: 'OCT 2025', rotation: -3 },
  ];

  /* ─── Hero + Gallery scroll animations ─── */
  useEffect(() => {
    const updateAnimation = () => {
      if (!scrollContainerRef.current || !heroTextRef.current || !heroCardRef.current || !heroImgRef.current) return;

      const rect = scrollContainerRef.current.getBoundingClientRect();
      const scrollDistance = scrollContainerRef.current.offsetHeight - window.innerHeight;
      let progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const isDesktop = window.innerWidth >= 768;

      const textScale = 1 + 0.35 * (1 - easeOut);
      const textTranslateX = isDesktop ? 25 * (1 - easeOut) : 0;
      const textTranslateY = isDesktop ? 0 : 20 * (1 - easeOut);
      const cardScale = 1.0 - 0.15 * easeOut;
      const borderRadius = 12 + 36 * easeOut;
      const imgScale = 1 + 0.15 * easeOut;

      heroTextRef.current.style.transform = `translate(${textTranslateX}vw, ${textTranslateY}vh) scale(${textScale})`;
      heroCardRef.current.style.transform = `scale(${cardScale})`;
      heroCardRef.current.style.borderRadius = `${borderRadius}px`;
      heroImgRef.current.style.transform = `scale(${imgScale})`;

      /* Gallery stack */
      if (galleryContainerRef.current) {
        const galRect = galleryContainerRef.current.getBoundingClientRect();
        const totalHeight = galleryContainerRef.current.offsetHeight - window.innerHeight;
        let galProgress = Math.max(0, Math.min(1, -galRect.top / totalHeight));

        polaroidRefs.current.forEach((ref, index) => {
          if (!ref) return;
          const startThreshold = index / photos.length;
          let cardProgress = galProgress > startThreshold
            ? (galProgress - startThreshold) / (1 / photos.length) : 0;
          cardProgress = Math.max(0, Math.min(1, cardProgress));

          const isFirst = index === 0;
          ref.style.opacity = isFirst ? 1 : cardProgress;
          const translateY = isFirst ? 0 : (1 - cardProgress) * (window.innerHeight * 0.8);
          const rotate = isFirst ? photos[index].rotation : (1 - cardProgress) * 25 + photos[index].rotation;
          const scale = isFirst ? 1 : 0.85 + cardProgress * 0.15;
          ref.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
          ref.style.zIndex = index + 10;
        });
      }
    };

    const onScroll = () => requestAnimationFrame(updateAnimation);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateAnimation();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  /* ─── RSVP state ─── */
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvp = useCallback((e) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  }, []);

  return (
    <div className="antialiased">
      {/* ── Navbar ── */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 md:gap-10 px-4 md:px-6 py-2 bg-[#FDFBF7]/80 backdrop-blur-md border border-[#B76E79]/30 rounded-full shadow-lg overflow-x-auto max-w-[92vw] whitespace-nowrap hide-scrollbar">
        {[
          ['#home', 'Inicio'], ['#details', 'Detalles'], ['#gallery', 'Galería'],
          ['#mensaje', 'Mensaje'], ['#countdown', 'Conteo'],
          ['#timeline', 'Historia'], ['#rsvp', 'RSVP'],
        ].map(([href, label]) => (
          <a key={href} href={href}
            className="font-playfair text-[11px] md:text-sm text-[#b2693f]/80 hover:text-[#D4AF37] active:text-[#D4AF37] transition-colors tracking-wider py-1">
            {label}
          </a>
        ))}
      </nav>

      {/* ── Hero ── */}
      <div id="home" ref={scrollContainerRef} className="relative w-full h-[250vh]">
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col md:flex-row items-center justify-center overflow-hidden bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD]">
          <div className="w-full md:w-[50%] h-[45%] md:h-full flex items-center justify-center relative z-10 px-4 md:px-12">
            <div ref={heroTextRef} className="flex flex-col items-center text-center will-change-transform origin-center">
              <p className="text-xs md:text-base lg:text-lg tracking-[0.15em] md:tracking-[0.3em] uppercase text-[#b2693f]/80 mb-3 md:mb-4 text-balance px-2">
                Acompáñanos a celebrar los XV años de
              </p>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-cursive-elegant font-normal text-[#b2693f] leading-tight drop-shadow-md px-2">
                Sofía Becerra Martínez
              </h1>
            </div>
          </div>
          <div className="w-full md:w-[50%] h-[55%] md:h-full flex items-center justify-center relative z-0 p-4 md:pr-12 md:py-16">
            <div ref={heroCardRef}
              className="relative w-full h-full origin-center overflow-hidden shadow-[0_10px_40px_rgba(183,110,121,0.3)] will-change-transform border border-[#B76E79]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={heroImgRef}
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="Sofia XV Cinematic"
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <section id="details"
        className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] min-h-screen flex flex-col justify-center py-16 px-4 md:px-6 border-t border-[#B76E79]/20">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-2xl md:text-5xl mb-4 md:mb-6 font-light text-[#b2693f]">Una Noche para Recordar</h2>
          <p className="text-sm md:text-lg text-[#b2693f]/80 leading-relaxed mb-6 md:mb-10 px-2">
            Acompáñanos a una velada inolvidable de elegancia, música y celebración mientras Sofía entra en un nuevo capítulo de su vida. Estamos emocionados de compartir este hermoso hito con nuestros familiares y amigos más cercanos.
          </p>
          <div className="relative w-full h-40 md:h-[35vh] max-h-80 rounded-2xl md:rounded-3xl overflow-hidden border border-[#B76E79]/30 mb-6 md:mb-10 shadow-[0_15px_40px_rgba(183,110,121,0.2)] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
              alt="Grand Plaza Estate Venue"
              className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 text-left">
            {[
              { title: 'La Fecha', text: <>Sábado, 1 de Agosto<br/>A partir de las 7:00 PM</> },
              { title: 'El Lugar', text: <>Grand Plaza Estate<br/>123 Crystal Avenue</> },
              { title: 'Código de Vestimenta', text: <>Formal / Etiqueta Opcional<br/>Elegancia Cinematográfica</> },
            ].map(card => (
              <div key={card.title}
                className="p-4 md:p-6 border border-[#B76E79]/30 rounded-2xl bg-[#FDFBF7]/80 backdrop-blur-sm transition-transform hover:-translate-y-1 hover:border-[#D4AF37]/50 duration-300">
                <h3 className="text-base md:text-xl font-serif mb-1 md:mb-2 text-[#b2693f]">{card.title}</h3>
                <p className="text-sm md:text-base text-[#b2693f]/80">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" ref={galleryContainerRef}
        className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] border-t border-[#B76E79]/20"
        style={{ height: `${photos.length * 100}vh` }}>
        <div className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
          <h2 className="absolute top-20 md:top-32 text-3xl md:text-5xl font-light text-[#b2693f] z-0">Recuerdos</h2>
          <div className="relative w-[80vw] max-w-[300px] md:max-w-[400px] aspect-[4/5] mt-12 md:mt-20">
            {photos.map((photo, index) => (
              <div key={photo.id}
                ref={el => (polaroidRefs.current[index] = el)}
                className="absolute inset-0 origin-center will-change-transform"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(183,110,121,0.2))' }}>
                <div className="w-full h-full bg-[#FDFBF7] p-3 pb-10 md:p-5 md:pb-16 shadow-xl border border-[#B76E79]/30 flex flex-col">
                  <div className="relative flex-1 bg-[#F5E6D3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.caption}
                      className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                      loading="lazy"
                    />
                  </div>
                  <p className="font-playfair text-[#b2693f] mt-3 md:mt-5 text-lg md:text-2xl text-center tracking-wide">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Message ── */}
      <section id="mensaje"
        className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] py-16 px-4 md:px-6 border-t border-[#B76E79]/20">
        <div className="max-w-4xl mx-auto text-center px-2 md:px-8">
          <ScrollReveal
            text="A lo largo de estos quince años, he aprendido que la magia de la vida reside en los momentos compartidos. Gracias por ser parte de mi historia, por su amor incondicional, y por acompañarme a celebrar esta noche tan especial y verdaderamente inolvidable."
            scrollHeight="200vh"
            stickyTop="25vh"
            colorStart="rgba(178, 105, 63, 0.15)"
            colorEnd="#b2693f"
            className="font-playfair text-xl md:text-4xl lg:text-5xl leading-relaxed md:leading-[1.5] tracking-tight"
          />
          <div className="mt-10 pb-12 md:pb-16 flex justify-center">
            <p className="text-[#b2693f]/70 text-xl md:text-4xl font-playfair italic">- Sofía</p>
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <CountdownSection />

      {/* ── Timeline ── */}
      <section id="timeline"
        className="relative z-10 w-full bg-gradient-to-b from-[#F0D5DD] to-[#F5E6D3] pt-24 md:pt-32 pb-20 border-t border-[#B76E79]/20 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-4 md:px-6 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-light text-[#b2693f] mb-4 md:mb-6">A Través de los Años</h2>
          <p className="text-sm md:text-xl text-[#b2693f]/80 max-w-2xl mx-auto leading-relaxed">
            Un viaje a través de nuestras capturas favoritas. Pasa el cursor sobre una foto para pausar y ver más de cerca.
          </p>
        </div>
        <InfiniteCarousel items={timelinePhotos} speed={50} />
      </section>

      {/* ── RSVP ── */}
      <section id="rsvp"
        className="relative z-10 w-full bg-gradient-to-b from-[#F5E6D3] to-[#F0D5DD] py-24 md:py-32 px-4 md:px-6 border-t border-[#B76E79]/20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl mb-6 md:mb-8 font-light text-[#b2693f]">Confirmar Asistencia</h2>
          <p className="text-sm md:text-base text-[#b2693f]/80 mb-8 md:mb-12">Por favor, haznos saber si puedes asistir antes del 1 de julio.</p>

          {rsvpSubmitted ? (
            <div className="p-8 border border-[#B76E79]/30 rounded-2xl bg-[#FDFBF7]/80 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-playfair text-[#b2693f] mb-2">¡Gracias!</p>
              <p className="text-sm md:text-base text-[#b2693f]/80">Tu confirmación ha sido recibida. Nos vemos pronto.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:gap-6 text-left">
              <input type="text" placeholder="Nombre Completo"
                className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-base"
              />
              <input type="email" placeholder="Correo Electrónico"
                className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-base"
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="guestCount" className="text-[#b2693f]/80 text-xs md:text-sm ml-2">
                  Número Total de Invitados (incluyéndote a ti)
                </label>
                <input type="number" id="guestCount" min="1" placeholder="ej., 2"
                  className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors text-base"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="guestNames" className="text-[#b2693f]/80 text-xs md:text-sm ml-2">
                  Nombres de Invitados Adicionales
                </label>
                <textarea id="guestNames" rows="3"
                  placeholder="Por favor, escribe los nombres de tus acompañantes..."
                  className="w-full bg-[#FDFBF7] border border-[#B76E79]/40 shadow-sm rounded-xl px-5 py-3.5 md:px-6 md:py-4 text-[#b2693f] placeholder-[#b2693f]/50 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none text-base"
                />
              </div>
              <button type="button" onClick={handleRsvp}
                className="w-full bg-[#B76E79] text-white font-semibold rounded-xl px-6 py-4 mt-2 hover:bg-[#D4AF37] active:bg-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-base">
                Confirmar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
