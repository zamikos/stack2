import { useState, useEffect, useRef } from 'react';
import './ScrollingPhotoStack.css';

const Icons = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Heart: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Share: ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sps-bounce-icon"><path d="m6 9 6 6 6-6"/></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sps-info-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  )
};

const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    caption: 'Golden Hour in the City',
    date: 'Oct 12, 2023',
    rotation: -3,
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&q=80&w=800',
    caption: 'Mountain Escape',
    date: 'Nov 05, 2023',
    rotation: 5,
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
    caption: 'Misty Forest Trails',
    date: 'Dec 18, 2023',
    rotation: -2,
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    caption: 'Summer Waves',
    date: 'Jan 22, 2024',
    rotation: 4,
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800',
    caption: 'Starry Night Cabin',
    date: 'Feb 14, 2024',
    rotation: -6,
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    caption: 'The Peak of Serenity',
    date: 'Mar 30, 2024',
    rotation: 2,
  }
];

export default function ScrollingPhotoStack() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const windowHeight = window.innerHeight;
      const totalHeight = containerRef.current.scrollHeight - windowHeight;
      const currentScroll = window.scrollY - containerRef.current.offsetTop;
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sps-root">
      {/* Navigation Header */}
      <header className="sps-header">
        <div className="sps-header-left">
          <span className="sps-camera-icon"><Icons.Camera /></span>
          <h1 className="sps-logo">MemoryStack</h1>
        </div>
        <button className="sps-subscribe-btn">Subscribe</button>
      </header>

      {/* Intro Section */}
      <section className="sps-intro">
        <h2 className="sps-intro-title">Captured Moments</h2>
        <p className="sps-intro-subtitle">
          Scroll down to watch the memories stack up, one Polaroid at a time.
        </p>
        <div className="sps-bounce-wrap">
          <Icons.ChevronDown />
        </div>
      </section>

      {/* Main Scrolling Content */}
      <div
        ref={containerRef}
        className="sps-scroll-container"
        style={{ height: `${photos.length * 100}vh` }}
      >
        <div className="sps-sticky-viewport">
          <div className="sps-card-area">
            {photos.map((photo, index) => {
              const startThreshold = index / photos.length;
              let cardProgress = 0;
              if (scrollProgress > startThreshold) {
                cardProgress = (scrollProgress - startThreshold) / (1 / photos.length);
              }
              cardProgress = Math.min(Math.max(cardProgress, 0), 1);

              const isFirst = index === 0;
              const opacity = isFirst ? 1 : cardProgress;
              const translateY = isFirst ? 0 : (1 - cardProgress) * 600;
              const rotate = isFirst ? photo.rotation : (1 - cardProgress) * 25 + photo.rotation;
              const scale = isFirst ? 1 : 0.85 + cardProgress * 0.15;

              return (
                <div
                  key={photo.id}
                  className="sps-card-wrapper"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                    zIndex: index + 10,
                    filter: `drop-shadow(0 15px 25px rgba(0,0,0,${0.15 + index * 0.03}))`,
                  }}
                >
                  <div className="sps-polaroid">
                    <div className="sps-polaroid-image-wrap">
                      <img src={photo.url} alt={photo.caption} />
                      <div className="sps-polaroid-image-overlay" />
                    </div>
                    <div className="sps-polaroid-footer">
                      <p className="sps-polaroid-caption">{photo.caption}</p>
                      <div className="sps-polaroid-meta">
                        <span className="sps-polaroid-date">{photo.date}</span>
                        <div className="sps-polaroid-actions">
                          <span className="sps-action-heart"><Icons.Heart /></span>
                          <span className="sps-action-share"><Icons.Share /></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Background Counter */}
          <div className="sps-bg-counter">
            {Math.min(Math.floor(scrollProgress * photos.length) + 1, photos.length)
              .toString()
              .padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <section className="sps-closing">
        <Icons.Info />
        <h3 className="sps-closing-title">The Collection is Complete</h3>
        <button
          className="sps-scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Scroll Back Up
        </button>
      </section>
    </div>
  );
}
