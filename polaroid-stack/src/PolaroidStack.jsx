import { useState, useEffect, useRef } from "react";
import "./PolaroidStack.css";

const POLAROIDS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    caption: "Golden Valley",
    rotation: -3,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
    caption: "Seaside Morning",
    rotation: 4,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1470770841497-7b3202f34039?w=600&q=80",
    caption: "Mountain Haze",
    rotation: -2,
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    caption: "Turquoise Shore",
    rotation: 5,
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1518173946687-a9cafbaf8fa0?w=600&q=80",
    caption: "City Lights",
    rotation: -4,
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
    caption: "Urban Dusk",
    rotation: 2,
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
    caption: "Misty Lake",
    rotation: -5,
  },
];

const SCROLL_PER_CARD = 600;

export default function PolaroidStack() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [prevCount, setPrevCount] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolledInto = -rect.top;
      const count = Math.min(
        POLAROIDS.length,
        Math.max(1, Math.floor(scrolledInto / SCROLL_PER_CARD) + 1)
      );
      setPrevCount(visibleCount);
      setVisibleCount(count);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount]);

  const totalScrollHeight =
    SCROLL_PER_CARD * POLAROIDS.length + window.innerHeight;

  return (
    <>
      <div className="grain-overlay" />

      {/* === HERO === */}
      <section className="hero-section">
        <h1 className="hero-title">Memories</h1>
        <p className="hero-subtitle">scroll to unveil the stack</p>
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* === SCROLL STACK === */}
      <div
        className="scroll-container"
        ref={containerRef}
        style={{ height: totalScrollHeight }}
      >
        <div className="sticky-frame">
          <div className="stack-surface">
            {POLAROIDS.map((p, i) => {
              const isVisible = i < visibleCount;
              const isNew = i === visibleCount - 1 && visibleCount > prevCount;
              const stackOffset = isVisible ? i * 3 : 0;

              if (!isVisible) return null;

              return (
                <div
                  key={p.id}
                  className={`polaroid${isNew ? " entering" : ""}`}
                  style={{
                    transform: `rotate(${p.rotation}deg) translateY(${-stackOffset}px)`,
                    zIndex: i + 1,
                  }}
                >
                  <div className="tape" />
                  <div className="polaroid-img-wrap">
                    <img src={p.url} alt={p.caption} loading="lazy" />
                  </div>
                  <p className="polaroid-caption">{p.caption}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === COUNTER === */}
      <div className="counter-badge">
        {visibleCount} / {POLAROIDS.length}
      </div>

      {/* === END === */}
      <section className="end-section">
        <h2>fin.</h2>
        <p>all memories revealed</p>
      </section>
    </>
  );
}
