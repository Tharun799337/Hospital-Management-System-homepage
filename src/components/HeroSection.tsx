import { useEffect, useRef, useState } from 'react';
import heroImg from '../assets/new_hero.png';

const NAVY = '#1b3560';
const GOLD = '#d97706';

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const formattedCount = target >= 1000 ? (count / 1000).toFixed(count >= 1000 && count < 10000 ? 1 : 0) + 'k' : count;
  return <span ref={ref}>{formattedCount}{suffix}</span>;
}

interface HeroProps {
  onBook: () => void;
  onDoctors: () => void;
}

export default function HeroSection({ onBook, onDoctors }: HeroProps) {


  const statsBar = [
    { value: 25, label: 'Years of Excellence', suffix: '+', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <path d="M8 21h8M12 17v4M7 4H4v5a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V4h-3"/>
        <rect x="7" y="2" width="10" height="4" rx="1"/>
      </svg>
    )},
    { value: 15, label: 'Specialities', suffix: '+', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2a9 9 0 0 1 9 9c0 3.5-2 6.5-4.5 8.5L12 22l-4.5-2.5C5 17.5 3 14.5 3 11a9 9 0 0 1 9-9z"/>
        <line x1="12" y1="7" x2="12" y2="13"/>
        <line x1="9" y1="10" x2="15" y2="10"/>
      </svg>
    )},
    { value: 120, label: 'Expert Doctors', suffix: '+', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <line x1="12" y1="14" x2="12" y2="17"/>
        <line x1="10.5" y1="15.5" x2="13.5" y2="15.5"/>
      </svg>
    )},
    { value: 500, label: 'Hospital Beds', suffix: '+', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 7v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M3 13h18" />
        <path d="M8 7v6" />
        <path d="M16 7v6" />
      </svg>
    )},
    { value: 355, label: 'Happy Patients', suffix: 'k+', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { value: 24, label: 'Emergency Care', suffix: '/7', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15 15"/>
      </svg>
    )},
  ];

  return (
    <>
      <style>{`
        /* Hero section padding for sticky header (measured header = 114.625px) */
        section.hv-hero {
          padding-top: 140px !important;
          background: #f8f9fc;
          overflow: hidden;
        }

        .hv-hero-inner {
          width: 100%;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 58% 42%;
          min-height: 300px;
          align-items: stretch;
          box-sizing: border-box;
        }

        /* LEFT: text content */
        .hv-hero-content {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 3.5rem 2rem 3.5rem 0;
        }

        .hv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #fef3c7;
          color: ${GOLD};
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          margin-bottom: 1.4rem;
          width: fit-content;
          border: 1px solid #fde68a;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        .hv-hero-h1 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          line-height: 1.15;
          color: ${NAVY};
          margin-bottom: 1.1rem;
          letter-spacing: -0.025em;
        }

        .hv-hero-h1 span {
          color: ${GOLD};
        }

        .hv-hero-desc {
          color: #475569;
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.8;
          margin-bottom: 1.4rem;
          max-width: 740px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Mini stats strip */
        .hv-hero-mini-stats {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(27, 53, 96, 0.12);
          width: fit-content;
        }

        .hv-mini-stat {
          padding: 0.7rem 1.2rem;
          text-align: center;
          border-right: 1px solid rgba(27, 53, 96, 0.1);
          background: white;
        }
        .hv-mini-stat:last-child { border-right: none; }

        .hv-mini-stat-num {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          color: ${NAVY};
          line-height: 1;
        }

        .hv-mini-stat-lbl {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 0.18rem;
          letter-spacing: 0.04em;
          font-family: 'DM Sans', sans-serif;
        }

        /* CTAs */
        .hv-hero-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 2rem;
        }

        .hv-btn-primary {
          background: ${NAVY};
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 9px;
          font-weight: 700;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(27, 53, 96, 0.28);
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.2s;
        }
        .hv-btn-primary:hover { transform: translateY(-1px); opacity: 0.9; }

        .hv-btn-secondary-hero {
          color: ${NAVY};
          padding: 0.75rem 1.5rem;
          border-radius: 9px;
          font-weight: 600;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1.5px solid rgba(27, 53, 96, 0.2);
          text-decoration: none;
          background: white;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .hv-btn-secondary-hero:hover { border-color: ${NAVY}; background: rgba(27,53,96,0.04); }

        /* Doctor avatars row */
        .hv-hero-doctors {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hv-hero-avatars {
          display: flex;
        }

        .hv-hero-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
        .hv-hero-avatar:not(:first-child) { margin-left: -10px; }

        .hv-hero-doctor-info { font-family: 'DM Sans', sans-serif; }
        .hv-hero-doctor-title { font-weight: 700; font-size: 0.82rem; color: ${NAVY}; }
        .hv-hero-doctor-sub { font-size: 0.7rem; color: #94a3b8; }

        /* RIGHT: image */
        .hv-hero-img-wrapper {
          position: relative;
          min-height: 240px;
          margin: 1.5rem 0 1.5rem 1rem;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(27, 53, 96, 0.15);
          box-shadow: 0 12px 40px rgba(27, 53, 96, 0.12);
        }

        .hv-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        /* Rating badge on image */
        .hv-hero-img-badge {
          position: absolute;
          bottom: 1.2rem; left: 1.2rem;
          background: white;
          border-radius: 12px;
          padding: 0.7rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .hv-hero-badge-icon {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hv-hero-badge-num {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 0.92rem;
          color: ${NAVY};
          line-height: 1;
        }

        .hv-hero-badge-lbl {
          font-size: 0.65rem;
          color: #94a3b8;
          margin-top: 0.1rem;
          font-family: 'DM Sans', sans-serif;
        }

        /* Stats bar below hero */
        .hv-stats-bar {
          background: ${NAVY};
          width: 100%;
          overflow: hidden;
        }

        .hv-stats-bar-inner {
          width: 100%;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          box-sizing: border-box;
        }

        @keyframes statDrop {
          0%   { opacity: 0; transform: translateY(-28px) scale(0.92); }
          60%  { opacity: 1; transform: translateY(4px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hv-stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.2rem;
          justify-content: center;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          animation: statDrop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .hv-stat-item:last-child { border-right: none; }
        .hv-stat-item:nth-child(1) { animation-delay: 0.1s; }
        .hv-stat-item:nth-child(2) { animation-delay: 0.22s; }
        .hv-stat-item:nth-child(3) { animation-delay: 0.34s; }
        .hv-stat-item:nth-child(4) { animation-delay: 0.46s; }
        .hv-stat-item:nth-child(5) { animation-delay: 0.58s; }
        .hv-stat-item:nth-child(6) { animation-delay: 0.70s; }

        .hv-stat-icon-box {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(217, 119, 6, 0.15);
          border: 1px solid rgba(217, 119, 6, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hv-stat-num {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.45rem;
          line-height: 1;
          color: white;
          letter-spacing: -0.02em;
        }

        .hv-stat-lbl {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.2rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hv-hero-inner {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 0 1.5rem;
          }
          .hv-hero-content {
            padding: 2.5rem 0;
          }
          .hv-hero-img-wrapper {
            min-height: 320px;
            margin: 0 0 1.5rem;
          }
          .hv-stats-bar-inner {
            grid-template-columns: repeat(3, 1fr);
          }
          .hv-stat-item:nth-child(3n) { border-right: none; }
          .hv-stat-item:nth-child(n+4) {
            border-top: 1px solid rgba(255,255,255,0.1);
          }
        }

        @media (max-width: 600px) {
          .hv-hero-content { padding: 2rem 1.25rem; }
          .hv-hero-img-wrapper { margin: 0 1rem 1rem; }
          .hv-stats-bar-inner { grid-template-columns: 1fr 1fr; }
          .hv-stat-item { border-right: 1px solid rgba(255,255,255,0.1); }
          .hv-stat-item:nth-child(2n) { border-right: none; }
          .hv-stat-item:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,0.1); }
          .hv-hero-mini-stats { width: 100%; }
          .hv-mini-stat { flex: 1; }
        }
      `}</style>

      <section id="home" className="hv-hero">
        <div className="hv-hero-inner">
          {/* Left: text */}
          <div className="hv-hero-content">
            {/* NABH Badge */}
            <div className="hv-hero-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              NABH Accredited · Trusted Since 2009
            </div>

            {/* Headline */}
            <h1 className="hv-hero-h1">
              Your Health,{' '}
              <span>Our Priority</span>
            </h1>

            {/* Tagline */}
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>
              NABH Accredited · ISO Certified · 24/7 Emergency
            </p>

            {/* Description */}
            <p className="hv-hero-desc">
              Haveda Hospital is a premier NABH-accredited multispeciality centre featuring 500+ beds, 120+ expert doctors, 15+ specialities, and dedicated 24/7 emergency care. Trusted by over 3,55,000 patients across the region, we blend cutting-edge medical technology with a compassionate, patient-first approach to deliver world-class healthcare right close to your home. From advanced diagnostics to personalized recovery plans, your well-being is our utmost priority.
            </p>


            {/* CTAs */}
            <div className="hv-hero-ctas">
              <button className="hv-btn-primary" onClick={onBook}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Book Appointment
              </button>
              <button className="hv-btn-secondary-hero" onClick={onDoctors}>
                Our Departments
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Doctor avatars */}
            <div className="hv-hero-doctors">
              <div className="hv-hero-avatars">
                {[
                  'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=40&h=40&fit=crop&auto=format',
                  'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=40&h=40&fit=crop&auto=format',
                  'https://images.unsplash.com/photo-1758691463393-a2aa9900af8a?w=40&h=40&fit=crop&auto=format',
                ].map((src, i) => (
                  <img key={i} src={src} alt="doctor" className="hv-hero-avatar" />
                ))}
              </div>
              <div className="hv-hero-doctor-info">
                <div className="hv-hero-doctor-title">120+ Expert Doctors</div>
                <div className="hv-hero-doctor-sub">Ready to serve you 24/7</div>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div className="hv-hero-img-wrapper">
            <img src={heroImg} alt="Haveda Hospital Facility" className="hv-hero-img" />
            {/* Rating badge */}
            <div className="hv-hero-img-badge">
              <div className="hv-hero-badge-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <div className="hv-hero-badge-num">4.9 / 5.0</div>
                <div className="hv-hero-badge-lbl">50,000+ Patient Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hv-stats-bar">
          <div className="hv-stats-bar-inner">
            {statsBar.map((s, i) => (
              <div key={s.label} className="hv-stat-item">
                <div className="hv-stat-icon-box">{s.icon}</div>
                <div>
                  <div className="hv-stat-num"><Counter target={s.value} suffix={s.suffix} /></div>
                  <div className="hv-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
