import React, { useState, useRef, useEffect } from 'react';

const NAVY = "#1b3560";
const GOLD = "#d97706";

const services = [
  { 
    title: "Emergency Care",       
    desc: "24/7 rapid emergency response", 
    img: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?w=800&q=80",
    details: "Our Emergency Care unit is fully equipped to handle all medical emergencies 24/7. Our rapid response team includes trauma specialists, emergency physicians, and dedicated nursing staff. We have advanced life support ambulances ready to be dispatched at a moment's notice.\n\nAmbulance Contact Number: 108 / +91 79950 74500"
  },
  { 
    title: "Diagnostic Services",  
    desc: "Advanced labs & imaging",        
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    details: "We offer comprehensive diagnostic services including MRI, CT Scan, X-Ray, Ultrasound, and a fully automated pathology laboratory. Our advanced imaging and testing facilities ensure accurate and quick diagnoses, enabling our doctors to begin the right treatment without delay."
  },
  { 
    title: "Surgical Care",        
    desc: "Minimally invasive procedures",   
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    details: "Our highly skilled surgical team specializes in both open and minimally invasive (laparoscopic) procedures. With state-of-the-art operating theaters equipped with the latest surgical technology, we prioritize patient safety, shorter recovery times, and optimal surgical outcomes."
  },
  { 
    title: "ICU & Critical Care",  
    desc: "State-of-the-art critical units", 
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    details: "Our Intensive Care Units (ICU) are designed to provide specialized care for critically ill patients. Each bed is equipped with advanced physiological monitoring systems and ventilators, staffed 24/7 by specialized intensivists and critical care nurses."
  },
  { 
    title: "Pharmacy",             
    desc: "Medicines & healthcare products", 
    img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    details: "Our 24-hour in-house pharmacy ensures that all prescribed medications, life-saving drugs, and healthcare products are readily available. We maintain stringent quality control and offer medication counseling to our patients."
  },
  { 
    title: "Rehabilitation",       
    desc: "Personalised recovery therapy",   
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    details: "Our Rehabilitation center focuses on restoring function and improving the quality of life for patients recovering from surgery, injury, or neurological conditions. We offer personalized physiotherapy, occupational therapy, and speech therapy programs."
  },
];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!isHovered.current) {
        const firstChild = container.firstElementChild as HTMLElement;
        if (!firstChild) return;
        
        const cardWidth = firstChild.offsetWidth;
        const gap = 24; // 1.5rem is roughly 24px
        const scrollAmount = cardWidth + gap;

        // If reached the end, scroll back to start
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .hv-services-grid {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding-bottom: 2rem;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hv-services-grid::-webkit-scrollbar {
          display: none;
        }

        .hv-services-grid > div {
          flex: 0 0 calc(33.333% - 1rem);
          min-width: 320px;
          scroll-snap-align: start;
        }

        @media (max-width: 900px) {
          .hv-services-grid > div {
            flex: 0 0 calc(50% - 0.75rem);
          }
        }

        @media (max-width: 600px) {
          .hv-services-grid > div {
            flex: 0 0 100%;
          }
        }

        .service-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 45, 82, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .service-modal-content {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: modalFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <section id="services" style={{ backgroundColor: "#f8f9fc", padding: "5rem 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>What We Offer</p>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2.2rem", color: NAVY, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Our <span style={{ color: GOLD }}>Services</span>
              </h2>
            </div>
          </div>

          {/* Grid */}
          <div 
            className="hv-services-grid"
            ref={scrollRef}
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; }}
          >
            {services.map((s) => (
              <div
                key={s.title}
                onClick={() => setSelectedService(s)}
                style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", border: "1.5px solid rgba(27,53,96,0.08)", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(27,53,96,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--teal)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(27,53,96,0.08)"; }}
              >
                <div style={{ backgroundColor: "#eef2fb", height: "200px", overflow: "hidden" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }} 
                       onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} 
                       onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: NAVY, marginBottom: "0.5rem" }}>{s.title}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#64748b", lineHeight: 1.5, marginBottom: "1.25rem" }}>{s.desc}</p>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: GOLD, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    Learn More <i className="fas fa-arrow-right" style={{ fontSize: "0.75rem" }}></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="service-modal-content" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedService(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", width: "32px", height: "32px", borderRadius: "50%", background: "white", border: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: NAVY, zIndex: 10 }}
            >
              <i className="fas fa-times"></i>
            </button>
            <div style={{ height: "250px", overflow: "hidden" }}>
              <img src={selectedService.img} alt={selectedService.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "2rem" }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>{selectedService.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: GOLD, fontWeight: 600, marginBottom: "1.5rem" }}>{selectedService.desc}</p>
              
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {selectedService.details}
              </div>

              {selectedService.title === "Emergency Care" && (
                <div style={{ marginTop: "2rem", padding: "1.25rem", background: "rgba(217, 119, 6, 0.1)", borderRadius: "12px", border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: GOLD, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>
                    <i className="fas fa-ambulance"></i>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>24/7 Ambulance Service</p>
                    <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: NAVY }}>Dial 108 or +91 79950 74500</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
