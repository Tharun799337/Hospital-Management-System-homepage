import React, { useEffect, useState } from 'react';

const NAVY = "#1b3560";
const GOLD = "#d97706";
const DARK = "#0d1625";

export function ProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollTop;
      const heightWin = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(scrollTotal / heightWin) * 100}`;
      setWidth(parseFloat(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        backgroundColor: GOLD,
        width: `${width}%`,
        zIndex: 10001,
        transition: 'width 0.2s ease-out'
      }}
    />
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: NAVY,
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 24px rgba(27, 53, 96, 0.25)',
        cursor: 'pointer',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, opacity 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  );
}

// -------------------------------------------------------------
// Contact Us Section (Reference Design)
// -------------------------------------------------------------
function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const info = [
    { label: "Our Address", value: "123 HealthCare Lane, Medical City, NC 12345", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { label: "Phone Number",  value: "+91 1800 123 4567",            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg> },
    { label: "Email Address", value: "info@havedahospital.com",    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
    { label: "Working Hours", value: "Mon–Sat: 8:00 AM – 8:00 PM · Emergency 24/7", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  ];

  return (
    <>
      <style>{`
        .hv-contact-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 2.5rem;
        }
        @media (max-width: 900px) {
          .hv-contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section id="contact" style={{ backgroundColor: "#f8f9fc", padding: "4rem 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: GOLD, letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>Get In Touch</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: NAVY, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Contact <span style={{ color: GOLD }}>Us</span>
            </h2>
          </div>

          <div className="hv-contact-grid">
            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Map Embedded */}
              <div style={{ borderRadius: "14px", overflow: "hidden", height: "180px", border: "1.5px solid rgba(27,53,96,0.1)", marginBottom: "0.5rem", position: "relative" }}>
                <iframe 
                  src="https://maps.google.com/maps?q=Hospital&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hospital Location"
                ></iframe>
              </div>
              {info.map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", padding: "0.9rem 1rem", backgroundColor: "white", borderRadius: "12px", border: "1.5px solid rgba(27,53,96,0.08)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.78rem", color: NAVY }}>{item.label}</p>
                    <p style={{ fontSize: "0.73rem", color: "#64748b", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "2rem", border: "1.5px solid rgba(27,53,96,0.08)", boxShadow: "0 4px 24px rgba(27,53,96,0.06)" }}>
              {sent ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", padding: "3rem 1rem", textAlign: "center" }}>
                  <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: NAVY }}>Message Sent!</p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>Our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} style={{ marginTop: "0.5rem", padding: "0.6rem 1.4rem", backgroundColor: NAVY, color: "white", borderRadius: "8px", border: "none", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: NAVY, marginBottom: "0.25rem" }}>Send Us a Message</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[{ name: "name", label: "Full Name *", placeholder: "John Doe", type: "text" }, { name: "email", label: "Email *", placeholder: "john@example.com", type: "email" }].map((f) => (
                      <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, fontFamily: "'DM Sans', sans-serif" }}>{f.label}</label>
                        <input name={f.name} value={(form as any)[f.name]} onChange={handleChange} required type={f.type} placeholder={f.placeholder}
                          style={{ borderRadius: "8px", border: "1.5px solid rgba(27,53,96,0.15)", backgroundColor: "#f8f9fc", padding: "0.6rem 0.85rem", fontSize: "0.83rem", outline: "none", fontFamily: "'DM Sans', sans-serif", color: NAVY }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = NAVY; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(27,53,96,0.15)"; }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, fontFamily: "'DM Sans', sans-serif" }}>Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000"
                        style={{ borderRadius: "8px", border: "1.5px solid rgba(27,53,96,0.15)", backgroundColor: "#f8f9fc", padding: "0.6rem 0.85rem", fontSize: "0.83rem", outline: "none", fontFamily: "'DM Sans', sans-serif", color: NAVY }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = NAVY; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(27,53,96,0.15)"; }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, fontFamily: "'DM Sans', sans-serif" }}>Subject *</label>
                      <select name="subject" value={form.subject} onChange={handleChange} required
                        style={{ borderRadius: "8px", border: "1.5px solid rgba(27,53,96,0.15)", backgroundColor: "#f8f9fc", padding: "0.6rem 0.85rem", fontSize: "0.83rem", outline: "none", fontFamily: "'DM Sans', sans-serif", color: NAVY }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = NAVY; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(27,53,96,0.15)"; }}
                      >
                        <option value="">Select subject</option>
                        <option>Book Appointment</option>
                        <option>General Inquiry</option>
                        <option>Billing & Insurance</option>
                        <option>Medical Records</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, fontFamily: "'DM Sans', sans-serif" }}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="How can we help you?"
                      style={{ borderRadius: "8px", border: "1.5px solid rgba(27,53,96,0.15)", backgroundColor: "#f8f9fc", padding: "0.6rem 0.85rem", fontSize: "0.83rem", outline: "none", fontFamily: "'DM Sans', sans-serif", color: NAVY, resize: "none" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = NAVY; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(27,53,96,0.15)"; }}
                    />
                  </div>
                  <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", backgroundColor: NAVY, color: "white", padding: "0.75rem", borderRadius: "9px", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 14px rgba(27,53,96,0.25)", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// -------------------------------------------------------------
// Main Footer
// -------------------------------------------------------------
interface FooterProps {
  onBook: () => void;
  onPortal: () => void;
}

export default function Footer({ onBook, onPortal }: FooterProps) {
  const footerCols = {
    "Quick Links":  ["Home", "About Us", "Our Doctors", "Services", "Health Packages", "Careers", "Contact Us"],
    "Departments":  ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology", "Dermatology", "View All"],
    "For Patients": ["Book Appointment", "Patient Portal", "Health Packages", "Insurance", "Pay Bill", "FAQ"],
  };

  return (
    <>
      <ContactUs />
      
      <style>{`
        .hv-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.4fr;
          gap: 2.5rem;
        }
        @media (max-width: 1024px) {
          .hv-footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .hv-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
      <footer style={{ backgroundColor: DARK, fontFamily: "'DM Sans', sans-serif" }}>

        {/* Footer body */}
        <div className="hv-footer-grid" style={{ maxWidth: "1280px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="10.5" y="3" width="3" height="18" rx="1.5" fill="white"/><rect x="3" y="10.5" width="18" height="3" rx="1.5" fill="white"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", color: "white", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Haveda</div>
                <div style={{ color: GOLD, fontSize: "0.55rem", letterSpacing: "0.22em", fontWeight: 700 }}>HOSPITAL</div>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "1.25rem", maxWidth: "260px" }}>
              Compassionate care, expert doctors, advanced technology — for a healthier tomorrow.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                <svg key="fb" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                <svg key="tw" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
                <svg key="li" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; (e.currentTarget as HTMLElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerCols).map(([section, links]) => (
            <div key={section}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1.2rem", fontFamily: "'DM Sans', sans-serif" }}>{section}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (l === 'Book Appointment') onBook();
                        if (l === 'Patient Portal') onPortal();
                      }}
                      style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1.2rem", fontFamily: "'DM Sans', sans-serif" }}>Contact</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { emoji: "📍", text: "123 HealthCare Lane, Medical City, NC 12345" },
                { emoji: "📞", text: "+91 1800 123 4567" },
                { emoji: "✉", text: "info@havedahospital.com" },
              ].map((c) => (
                <li key={c.emoji} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ color: GOLD, flexShrink: 0 }}>{c.emoji}</span>{c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", maxWidth: "1280px", margin: "0 auto", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>© 2024 Haveda Hospital. All Rights Reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Use", "Sitemap"].map((l) => (
              <a key={l} href="#" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
