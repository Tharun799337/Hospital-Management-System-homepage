import React from 'react';

const NAVY = "#1b3560";
const GOLD = "#d97706";

const news = [
  { id: 1, title: "New Advanced Cardiac Care Unit Launched at Haveda Hospital", date: "May 10, 2024", desc: "State-of-the-art facility with advanced technology for better patient outcomes.", img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=160&h=100&fit=crop&auto=format", tag: "Cardiology" },
  { id: 2, title: "Free Mega Health Check-up Camp This Weekend!", date: "May 5, 2024", desc: "Join us for a free full health check-up camp open to all age groups.", img: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=160&h=100&fit=crop&auto=format", tag: "Community" },
  { id: 3, title: "Tips for a Healthy Lifestyle from Our Experts", date: "May 3, 2024", desc: "Simple daily habits for a healthier and happier life, recommended by Haveda doctors.", img: "https://images.unsplash.com/photo-1622253694238-3b22139576c6?w=160&h=100&fit=crop&auto=format", tag: "Wellness" },
];

const awards = [
  { abbr: "NABH", color: NAVY,      bg: "#eef2fb", title: "NABH Accredited Hospital",     desc: "Excellence in patient safety and quality care." },
  { abbr: "★",    color: GOLD,      bg: "#fef3c7", title: "Best Multispeciality Hospital", desc: "City Health Awards 2023" },
  { abbr: "EPC",  color: "#2563eb", bg: "#eff6ff", title: "Excellence in Patient Care",    desc: "National Healthcare Awards 2022" },
  { abbr: "ISO",  color: "#7c3aed", bg: "#f3f0ff", title: "ISO 9001:2015 Certified",       desc: "For quality management systems." },
];

export default function NewsSection() {
  return (
    <>
      <style>{`
        .hv-news-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 900px) {
          .hv-news-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section id="news" style={{ backgroundColor: "#f8f9fc", padding: "4rem 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }} className="hv-news-grid">

          {/* News */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>Latest Updates</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: NAVY, marginBottom: "1.75rem", letterSpacing: "-0.02em" }}>
              News &amp; <span style={{ color: GOLD }}>Announcements</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {news.map((n) => (
                <div key={n.id} style={{ display: "flex", gap: "1rem", padding: "1rem", backgroundColor: "white", borderRadius: "12px", border: "1.5px solid rgba(27,53,96,0.08)", transition: "box-shadow 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(27,53,96,0.1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ borderRadius: "10px", overflow: "hidden", flexShrink: 0, backgroundColor: "#eef2fb" }}>
                    <img src={n.img} alt={n.title} style={{ width: "90px", height: "72px", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "inline-block", fontSize: "0.62rem", fontWeight: 700, color: GOLD, backgroundColor: "#fef3c7", padding: "0.15rem 0.5rem", borderRadius: "999px", marginBottom: "0.35rem", letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif" }}>{n.tag}</span>
                    <a href="#" style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: NAVY, lineHeight: 1.4, marginBottom: "0.25rem", textDecoration: "none" }}>{n.title}</a>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{n.desc}</p>
                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.35rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div id="awards">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>Recognition</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: NAVY, marginBottom: "1.75rem", letterSpacing: "-0.02em" }}>
              Awards &amp; <span style={{ color: GOLD }}>Accreditations</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {awards.map((a) => (
                <div key={a.title} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.2rem", backgroundColor: "white", borderRadius: "12px", border: "1.5px solid rgba(27,53,96,0.08)" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: a.color, fontWeight: 800, fontSize: a.abbr === "★" ? "1.5rem" : "0.6rem", letterSpacing: "0.03em", fontFamily: "'Outfit', sans-serif" }}>
                    {a.abbr}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: NAVY }}>{a.title}</p>
                    <p style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
