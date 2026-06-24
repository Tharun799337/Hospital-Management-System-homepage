import React from 'react';

const NAVY = "#1b3560";
const GOLD = "#d97706";

interface FeaturesSectionProps {
  onBook?: () => void;
  onDoctors?: () => void;
  onPortal?: () => void;
}

export default function FeaturesSection({ onBook, onDoctors, onPortal }: FeaturesSectionProps) {
  const actions = [
    {
      color: "#fef3c7", iconColor: GOLD,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/></svg>,
      title: "Book Appointment", desc: "Schedule with our specialists", 
      extra: "Next slot: Today",
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onBook?.(); }
    },
    {
      color: "#eff6ff", iconColor: "#2563eb",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
      title: "Find a Doctor", desc: "Search by specialty or name", 
      extra: "120+ Experts Ready",
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onDoctors?.(); }
    },
    {
      color: "#f3f0ff", iconColor: "#7c3aed",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title: "Our Services", desc: "Explore our healthcare range", 
      extra: "15+ Specialities",
      href: "#services"
    },
    {
      color: "#ecfdf5", iconColor: "#059669",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      title: "Find Location", desc: "Visit us at our nearest branch", 
      extra: "📍 View Campus Map",
      href: "#contact"
    },
    {
      color: "#fff1f2", iconColor: "#e11d48",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
      title: "Health Packages", desc: "View our comprehensive packages", 
      extra: "🏷️ Flat 20% Off",
      href: "#health-packages"
    },
    {
      color: "#eef2fb", iconColor: NAVY,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      title: "Patient Portal", desc: "Access your health records", 
      extra: "🔒 Encrypted Access",
      onClick: (e: React.MouseEvent) => { e.preventDefault(); onPortal?.(); }
    },
  ];

  return (
    <>
      <style>{`
        .hv-quick-actions {
          background-color: white;
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(27,53,96,0.08);
        }
        .hv-quick-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
        }
        .hv-qa-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.2rem 0.75rem;
          border-radius: 12px;
          border: 1.5px solid rgba(27,53,96,0.08);
          background-color: white;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .hv-qa-card:hover {
          border-color: ${NAVY};
          box-shadow: 0 4px 16px rgba(27,53,96,0.1);
        }
        .hv-qa-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.65rem;
        }
        .hv-qa-title {
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.77rem;
          color: ${NAVY};
          margin-bottom: 0.2rem; line-height: 1.3;
        }
        .hv-qa-desc {
          font-size: 0.65rem; color: #94a3b8;
          line-height: 1.4; margin-bottom: 0.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .hv-qa-arrow {
          font-size: 0.68rem; font-weight: 700; color: ${GOLD};
        }

        @media (max-width: 1024px) {
          .hv-quick-inner { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
        @media (max-width: 640px) {
          .hv-quick-inner { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <section className="hv-quick-actions">
        <div className="hv-quick-inner">
          {actions.map((a, i) => (
            <a
              key={i}
              href={a.href || "#"}
              onClick={(e) => {
                if (a.onClick) {
                  a.onClick(e);
                } else if (a.href?.startsWith("#") && a.href.length > 1) {
                  e.preventDefault();
                  document.querySelector(a.href)?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hv-qa-card"
            >
              <div className="hv-qa-icon" style={{ backgroundColor: a.color }}>{a.icon}</div>
              <p className="hv-qa-title">{a.title}</p>
              <p className="hv-qa-desc">{a.desc}</p>
              {a.extra && <div className="hv-qa-extra">{a.extra}</div>}
              <span className="hv-qa-arrow">→</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
