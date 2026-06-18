import { useEffect, useState } from 'react';
import havedaLogo from '../assets/haveda_logo.png';

const NAVY = '#1b3560';
const GOLD = '#d97706';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Departments', href: '#departments' },
  { label: 'News', href: '#news' },
  { label: 'Health Packages', href: '#health-packages' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onAppointmentClick?: () => void;
  onPortalClick?: () => void;
  onCancelClick?: () => void;
  onFeedbackClick?: () => void;
}

export default function Navbar({ onAppointmentClick, onPortalClick, onCancelClick, onFeedbackClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string, cb?: () => void) => {
    setMenuOpen(false);
    setActiveLink(href);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    cb?.();
  };

  return (
    <>
      <style>{`
        .hv-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          font-family: 'DM Sans', sans-serif;
        }

        /* Top utility bar */
        .hv-topbar {
          background: ${NAVY};
          color: white;
          font-size: 0.78rem;
          padding: 0.65rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hv-topbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hv-topbar-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          opacity: 0.9;
        }

        .hv-topbar-item strong {
          color: #fbbf24;
        }

        .hv-topbar-sep {
          opacity: 0.3;
        }

        .hv-topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.85;
        }

        .hv-topbar-link {
          color: inherit;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .hv-topbar-link:hover { opacity: 0.7; text-decoration: underline; }

        /* Main nav */
        .hv-nav {
          background: #ffffff;
          border-bottom: 1px solid rgba(27, 53, 96, 0.1);
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          min-height: 90px;
          box-shadow: 0 1px 12px rgba(27, 53, 96, 0.07);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .hv-nav.scrolled {
          box-shadow: 0 4px 20px rgba(27, 53, 96, 0.1);
        }

        /* Logo */
        .hv-logo {
          display: flex;
          align-items: center;
          justify-self: start;
          gap: 0.6rem;
          text-decoration: none;
          padding: 0.75rem 0;
          cursor: pointer;
        }

        /* Desktop links */
        .hv-links {
          display: flex;
          align-items: center;
          justify-self: center;
          gap: 0.15rem;
        }

        .hv-link {
          color: #4b5563;
          font-weight: 500;
          font-size: 0.88rem;
          padding: 1.1rem 0.8rem;
          text-decoration: none;
          border-bottom: 2.5px solid transparent;
          transition: all 0.2s;
          white-space: nowrap;
          cursor: pointer;
          border-left: none;
          border-right: none;
          border-top: none;
          background: none;
          display: inline-flex;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
        }

        .hv-link:hover {
          color: ${NAVY};
          border-bottom-color: rgba(217, 119, 6, 0.4);
        }

        .hv-link.active {
          color: ${NAVY};
          font-weight: 700;
          border-bottom-color: ${GOLD};
        }

        /* Actions */
        .hv-actions {
          display: flex;
          align-items: center;
          justify-self: end;
          gap: 0.75rem;
        }

        .hv-btn-portal {
          background: transparent;
          border: 1.5px solid rgba(27, 53, 96, 0.2);
          color: ${NAVY};
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          background-color: white;
        }
        .hv-btn-portal:hover {
          border-color: ${NAVY};
          background: rgba(27, 53, 96, 0.04);
        }

        .hv-btn-book {
          background: ${NAVY};
          border: none;
          color: #ffffff;
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          box-shadow: 0 4px 14px rgba(27, 53, 96, 0.25);
          transition: opacity 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .hv-btn-book:hover { opacity: 0.88; }

        /* Hamburger */
        .hv-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: ${NAVY};
          cursor: pointer;
          padding: 0.4rem;
        }

        /* Overlay */
        .hv-overlay {
          position: fixed; inset: 0;
          background: rgba(27, 53, 96, 0.4);
          backdrop-filter: blur(4px);
          z-index: 99998;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .hv-overlay.open { opacity: 1; pointer-events: auto; }

        /* Mobile sidebar */
        .hv-sidebar {
          position: fixed; top: 0; right: -320px;
          width: 300px; height: 100vh;
          background: #ffffff;
          box-shadow: -4px 0 24px rgba(27, 53, 96, 0.12);
          z-index: 99999;
          padding: 1.5rem;
          transition: right 0.3s ease;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .hv-sidebar.open { right: 0; }

        .hv-sb-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(27, 53, 96, 0.08);
        }

        .hv-sb-close {
          background: rgba(27, 53, 96, 0.06);
          border: none;
          color: #64748b;
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 1.1rem;
        }
        .hv-sb-close:hover { background: rgba(27, 53, 96, 0.12); color: ${NAVY}; }

        .hv-sb-link {
          display: flex;
          align-items: center;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          color: #374151;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid rgba(27, 53, 96, 0.06);
          text-decoration: none;
        }
        .hv-sb-link:hover { background: rgba(27, 53, 96, 0.04); color: ${NAVY}; }
        .hv-sb-link.active { color: ${NAVY}; font-weight: 700; }

        .hv-sb-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(27, 53, 96, 0.08);
        }

        @media (max-width: 1080px) {
          .hv-links { display: none; }
          .hv-btn-portal { display: none; }
          .hv-btn-book { display: none; }
          .hv-hamburger { display: flex; }
          .hv-topbar-right { display: none; }
        }

        @media (max-width: 480px) {
          .hv-topbar-left { gap: 0.75rem; }
          .hv-topbar-item:last-child { display: none; }
          .hv-topbar-sep { display: none; }
        }
      `}</style>

      <header className="hv-header">
        {/* Top utility bar */}
        <div className="hv-topbar">
        </div>

        {/* Main nav */}
        <nav className={`hv-nav${scrolled ? ' scrolled' : ''}`}>
          {/* Logo */}
          <a className="hv-logo" href="#home" onClick={e => { e.preventDefault(); scrollTo('#home'); }}>
            <img src={havedaLogo} alt="Haveda Hospital Logo" style={{ height: '80px', width: 'auto', display: 'block', objectFit: 'contain', imageRendering: 'high-quality', mixBlendMode: 'multiply' }} />
          </a>

          {/* Desktop links */}
          <div className="hv-links">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`hv-link${activeLink === link.href ? ' active' : ''}`}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hv-actions">
            <button className="hv-btn-portal" onClick={() => onPortalClick?.()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Patient Portal
            </button>
            <button className="hv-btn-book" onClick={() => onAppointmentClick?.()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book Appointment
            </button>
            {/* Hamburger */}
            <button className="hv-hamburger" onClick={() => setMenuOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay */}
      <div className={`hv-overlay${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile sidebar */}
      <div className={`hv-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="hv-sb-header">
          <img src={havedaLogo} alt="Haveda Hospital" style={{ height: '32px' }} />
          <button className="hv-sb-close" onClick={() => setMenuOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`hv-sb-link${activeLink === link.href ? ' active' : ''}`}
            onClick={e => { e.preventDefault(); scrollTo(link.href); }}
          >
            {link.label}
          </a>
        ))}

        <div className="hv-sb-actions">
          <button
            onClick={() => { setMenuOpen(false); onPortalClick?.(); }}
            style={{ width: '100%', padding: '0.7rem', border: `1.5px solid rgba(27,53,96,0.2)`, borderRadius: '8px', background: 'white', color: NAVY, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Patient Portal
          </button>
          <button
            onClick={() => { setMenuOpen(false); onAppointmentClick?.(); }}
            style={{ width: '100%', padding: '0.7rem', border: 'none', borderRadius: '8px', background: NAVY, color: 'white', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
}
