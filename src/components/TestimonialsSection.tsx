import React, { useState } from "react";

const NAVY = "#1b3560";
const GOLD = "#d97706";

const reviews = [
  { id: 1, name: "Ramesh Iyer",    treatment: "Cardiac Surgery",          rating: 5, text: "The cardiology team at Haveda saved my life. Dr. Rajesh Sharma performed my bypass surgery with incredible precision. The staff was compassionate throughout my recovery. I am forever grateful.", img: "https://images.unsplash.com/photo-1606166228927-3feafb447265?w=80&h=80&fit=crop&auto=format", date: "March 2024" },
  { id: 2, name: "Sunita Patel",   treatment: "Orthopaedic Treatment",    rating: 5, text: "After years of knee pain, Dr. Suresh Pillai performed my knee replacement. Within 6 weeks I was walking without pain. The physiotherapy team was exceptional. Haveda truly lives up to its name.", img: "https://images.unsplash.com/photo-1550791871-0bcd47c97881?w=80&h=80&fit=crop&auto=format", date: "February 2024" },
  { id: 3, name: "Aditya Krishnan","treatment": "Neurology Consultation",  rating: 5, text: "Dr. Anil Gupta diagnosed my condition accurately when other hospitals had failed. His expertise in neurology is unmatched. The hospital is clean, modern and the staff is incredibly helpful.", img: "https://images.unsplash.com/photo-1606166187734-a4cb74079037?w=80&h=80&fit=crop&auto=format", date: "January 2024" },
  { id: 4, name: "Meera Nair",     treatment: "Maternity & Gynaecology",  rating: 5, text: "Dr. Smita Joshi and the maternity team made my delivery experience beautiful and stress-free. The NICU team took amazing care of my newborn. I cannot thank Haveda enough for their support.", img: "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=80&h=80&fit=crop&auto=format", date: "April 2024" },
  { id: 5, name: "Vikrant Sharma", treatment: "Ophthalmology – LASIK",    rating: 5, text: "Dr. Sunil Khanna performed my LASIK surgery and my vision is now perfect. The procedure was quick, painless and the follow-up care was excellent. The equipment and skilled team are outstanding.", img: "https://images.unsplash.com/photo-1765222385062-11262da1ff2e?w=80&h=80&fit=crop&auto=format", date: "May 2024" },
  { id: 6, name: "Lakshmi Reddy",  treatment: "Paediatric Care",          rating: 5, text: "Dr. Pooja Mathur treated my daughter with so much care and patience. She explained everything clearly and made my child feel comfortable. The paediatric ward is child-friendly. Best hospital!", img: "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=80&h=80&fit=crop&auto=format", date: "March 2024" },
];

const Star = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={GOLD} stroke={GOLD} strokeWidth="0.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(current * perPage, current * perPage + perPage);

  return (
    <>
      <style>{`
        .hv-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .hv-reviews-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .hv-reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section id="patient-reviews" style={{ backgroundColor: "white", padding: "4rem 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>What Patients Say</p>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: NAVY, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                Patient <span style={{ color: GOLD }}>Reviews</span>
              </h2>
            </div>
            {/* Pagination dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "28px" : "8px", height: "8px", borderRadius: "999px", backgroundColor: i === current ? NAVY : "#cbd5e1", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="hv-reviews-grid">
            {visible.map((r) => (
              <div key={r.id} style={{ backgroundColor: "#f8f9fc", borderRadius: "16px", padding: "1.5rem", border: "1.5px solid rgba(27,53,96,0.08)", display: "flex", flexDirection: "column" }}>
                {/* Quote mark + stars */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill={NAVY} opacity="0.12"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill={NAVY} opacity="0.12"/>
                  </svg>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} />)}
                  </div>
                </div>

                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#475569", lineHeight: 1.75, flex: 1 }}>"{r.text}"</p>

                <div style={{ borderTop: "1px solid rgba(27,53,96,0.08)", marginTop: "1rem", paddingTop: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img src={r.img} alt={r.name} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: NAVY }}>{r.name}</p>
                    <p style={{ fontSize: "0.7rem", color: GOLD, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{r.treatment}</p>
                  </div>
                  <p style={{ fontSize: "0.62rem", color: "#94a3b8", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
