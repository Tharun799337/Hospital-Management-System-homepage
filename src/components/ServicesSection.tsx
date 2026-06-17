import React from 'react';

const NAVY = "#1b3560";
const GOLD = "#d97706";

const services = [
  { title: "Emergency Care",       desc: "24/7 rapid emergency response", img: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?w=400&h=220&fit=crop&auto=format" },
  { title: "Diagnostic Services",  desc: "Advanced labs & imaging",        img: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=220&fit=crop&auto=format" },
  { title: "Surgical Care",        desc: "Minimally invasive procedures",   img: "https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?w=400&h=220&fit=crop&auto=format" },
  { title: "ICU & Critical Care",  desc: "State-of-the-art critical units", img: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=400&h=220&fit=crop&auto=format" },
  { title: "Pharmacy",             desc: "Medicines & healthcare products", img: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=220&fit=crop&auto=format" },
  { title: "Rehabilitation",       desc: "Personalised recovery therapy",   img: "https://images.unsplash.com/photo-1622253694238-3b22139576c6?w=400&h=220&fit=crop&auto=format" },
];

export default function ServicesSection() {
  return (
    <>
      <style>{`
        .hv-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .hv-services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .hv-services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section id="services" style={{ backgroundColor: "#f8f9fc", padding: "4rem 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>What We Offer</p>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: NAVY, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Our <span style={{ color: GOLD }}>Services</span>
              </h2>
            </div>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontSize: "0.85rem", fontWeight: 700, color: NAVY, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", borderBottom: `1.5px solid ${GOLD}`, paddingBottom: "2px" }}>
              View All Services →
            </a>
          </div>

          {/* Grid */}
          <div className="hv-services-grid">
            {services.map((s) => (
              <div
                key={s.title}
                style={{ backgroundColor: "white", borderRadius: "14px", overflow: "hidden", border: "1.5px solid rgba(27,53,96,0.08)", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(27,53,96,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
              >
                <div style={{ backgroundColor: "#eef2fb", height: "180px", overflow: "hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "1.25rem 1.4rem" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, marginBottom: "0.4rem" }}>{s.title}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5, marginBottom: "1rem" }}>{s.desc}</p>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: GOLD }}>Learn More →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
