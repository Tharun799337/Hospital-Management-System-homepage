import React, { useEffect, useState } from 'react';
import { fetchDoctors, Doctor } from '../api';

const TEAL = "#1b3560";
const GOLD = "#d97706";

const depts = [
  { name: "Cardiology",       icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { name: "Neurology",        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="5"/><path d="M7.5 8a4.5 4.5 0 0 1 9 0"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
  { name: "Orthopedics",      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 3c-1 0-2 .9-2 2v3l-2 2 2 2v3c0 1.1.9 2 2 2s2-.9 2-2v-3l2-2-2-2V5c0-1.1-.9-2-2-2z"/><path d="M15 3c1 0 2 .9 2 2v3l2 2-2 2v3c0 1.1-.9 2-2 2s-2-.9-2-2v-3l-2-2 2-2V5c0-1.1.9-2 2-2z"/></svg> },
  { name: "Pediatrics",       icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><line x1="12" y1="14" x2="12" y2="17"/><line x1="10" y1="15.5" x2="14" y2="15.5"/></svg> },
  { name: "Women & Child Care", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="9" r="5"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
  { name: "Dermatology",      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="10" r="6"/><circle cx="9.5" cy="9" r="1" fill="currentColor"/><circle cx="14.5" cy="9" r="1" fill="currentColor"/><path d="M9 13c.8 1.5 5.2 1.5 6 0"/><path d="M5 18c0 3 14 3 14 0"/></svg> },
  { name: "Gastroenterology", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3c-2 0-4 2-4 5s2 4 4 5 4 2 4 5-2 3-4 3"/><path d="M8 8c-2 0-3 1.5-3 3s1.5 3 3 3"/></svg> },
  { name: "Ophthalmology",    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> },
];

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ChevL = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>;
const ChevR = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>;

export default function DepartmentsSection({ onBook }: { onBook: (doctor: Doctor) => void }) {
  const [active, setActive] = useState("Cardiology");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const docData = await fetchDoctors();
        const docs = Array.isArray(docData) ? docData : (docData.data || []);
        setDoctors(docs);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    loadDoctors();
  }, []);

  const getDoctorTheme = (name: string) => {
    const n = name.toLowerCase();
    const isFemale = /\b(sarah|priya|neha|anjali|riya|women|mrs|miss|dr\.?\s*s|dr\.?\s*p|aisha)\b/i.test(n) || n.split(' ')[0].endsWith('a') || n.split(' ')[0].endsWith('i');
    return isFemale 
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name.replace(/dr\.?\s*/i, ''))}&background=fdf4ff&color=c026d3&size=256&font-size=0.4`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name.replace(/dr\.?\s*/i, ''))}&background=f0f9ff&color=0284c7&size=256&font-size=0.4`;
  };

  const filteredDoctors = doctors.filter(d => {
    if (!d.department) return false;
    if (active === 'Women & Child Care') return d.department.includes('Pediatric') || d.department.includes('Gyne');
    return d.department.toLowerCase().includes(active.toLowerCase());
  });

  const activeDeptsKeys = depts.filter(deptObj => 
    doctors.some(d => {
      if (!d.department) return false;
      if (deptObj.name === 'Women & Child Care') return d.department.includes('Pediatric') || d.department.includes('Gyne');
      return d.department.toLowerCase().includes(deptObj.name.toLowerCase());
    })
  );

  useEffect(() => {
    if (activeDeptsKeys.length > 0 && !activeDeptsKeys.find(d => d.name === active)) {
      setActive(activeDeptsKeys[0].name);
    }
  }, [doctors]); // Run only when doctors load

  return (
    <>
      <style>{`
        .hv-doc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          flex: 1;
        }
        @media (max-width: 1024px) {
          .hv-doc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .hv-doc-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
      <section id="departments" style={{ padding: "3rem 0", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>Meet Our Team</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: TEAL, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Find a <span style={{ color: GOLD }}>Doctor</span> by Department
            </h2>
          </div>

          {/* Department tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", flex: 1, paddingBottom: "0.25rem", scrollbarWidth: "none" }}>
              {activeDeptsKeys.length > 0 ? activeDeptsKeys.map((d) => {
                const isActive = active === d.name;
                return (
                  <button
                    key={d.name}
                    onClick={() => setActive(d.name)}
                    style={{
                      flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                      padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid", transition: "all 0.2s",
                      backgroundColor: isActive ? TEAL : "white",
                      borderColor: isActive ? TEAL : "#e5e7eb",
                      color: isActive ? "white" : "#4b5563",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.74rem", minWidth: "100px",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    <span style={{ color: isActive ? "white" : TEAL }}>{d.icon}</span>
                    {d.name}
                  </button>
                );
              }) : depts.map((d) => {
                const isActive = active === d.name;
                return (
                  <button
                    key={d.name}
                    onClick={() => setActive(d.name)}
                    style={{
                      flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
                      padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid", transition: "all 0.2s",
                      backgroundColor: isActive ? TEAL : "white",
                      borderColor: isActive ? TEAL : "#e5e7eb",
                      color: isActive ? "white" : "#4b5563",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.74rem", minWidth: "100px",
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    <span style={{ color: isActive ? "white" : TEAL }}>{d.icon}</span>
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor cards */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <div className="hv-doc-grid">
              {loading && <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading doctors...</p>}
              {!loading && filteredDoctors.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748b' }}>No specialists found for {active} at this time.</p>}
              {!loading && filteredDoctors.map((doc) => (
                <div key={doc.id} style={{ backgroundColor: "white", borderRadius: "12px", border: "1px solid #f3f4f6", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "box-shadow 0.2s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"} onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", top: "0.6rem", left: "0.6rem", backgroundColor: doc.is_active !== false ? "#22c55e" : "#f59e0b", color: "white", padding: "0.2rem 0.6rem", borderRadius: "999px", zIndex: 10, fontSize: "0.7rem", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                      {doc.is_active !== false ? 'Available Today' : 'Unavailable'}
                    </span>
                    <img src={doc.photo || getDoctorTheme(doc.name)} alt={doc.name} onError={(e) => { e.currentTarget.src = getDoctorTheme(doc.name) }} style={{ width: "100%", height: "220px", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <p style={{ color: "#111827", marginBottom: "0.2rem", fontWeight: 700, fontSize: "1rem", fontFamily: "'DM Sans', sans-serif" }}>{doc.name}</p>
                    <p style={{ color: TEAL, fontSize: "0.85rem", marginBottom: "0.2rem", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.department}</p>
                    {doc.qualification && (
                      <p style={{ color: "#06B6D4", marginBottom: "0.3rem", fontSize: "0.75rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        {doc.qualification}
                      </p>
                    )}
                    <p style={{ color: "#6b7280", marginBottom: "0.6rem", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif" }}>{doc.experience} Years Experience</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem" }}>
                      <StarIcon />
                      <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{doc.rating}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>({Math.floor(Math.random() * 200) + 50} reviews)</span>
                    </div>
                    <button
                      onClick={() => onBook(doc)}
                      style={{ display: "block", width: "100%", textAlign: "center", color: "white", borderRadius: "8px", padding: "0.6rem 0", transition: "opacity 0.2s", backgroundColor: TEAL, fontSize: "0.85rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      Book Appointment
                    </button>
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
