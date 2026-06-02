import { useEffect, useRef, useState } from 'react';
import { fetchTicker } from '../api';
import havedaLogo from '../assets/haveda_logo.png';

export function MarqueeTicker() {
  const [tickerItems, setTickerItems] = useState<{icon: string, text: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickerData = async () => {
      try {
        const data = await fetchTicker();
        setTickerItems(data);
      } catch (error) {
        console.error('Error fetching ticker data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTickerData();
  }, []);

  if (loading || tickerItems.length === 0) return null;
  return (
    <div className="marquee-wrapper" style={{ background: '#14B8A6', height: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
        <div className="latest-news-label" style={{ background: '#0F766E', color: 'white', padding: '0 1.5rem', height: '100%', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '0.8rem', zIndex: 2, flexShrink: 0 }}>
          <span className="desktop-text">LATEST NEWS</span>
          <i className="fas fa-bullhorn mobile-icon" style={{ display: 'none' }}></i>
        </div>
        <div className="marquee-inner" style={{ display: 'flex' }}>
          <div className="marquee-content" style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
            {tickerItems.map((item, i) => (
              <span key={`1-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'white' }}>
                <i className={item.icon} style={{ color: 'white', opacity: 0.8 }}></i>
                {item.text}
              </span>
            ))}
          </div>
          <div className="marquee-content" style={{ display: 'flex', gap: '3rem', paddingRight: '3rem' }}>
            {tickerItems.map((item, i) => (
              <span key={`2-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'white' }}>
                <i className={item.icon} style={{ color: 'white', opacity: 0.8 }}></i>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .latest-news-label { padding: 0 1rem !important; }
          .desktop-text { display: none !important; }
          .mobile-icon { display: block !important; font-size: 1.1rem; }
          .marquee-content { gap: 2rem !important; padding-right: 2rem !important; }
        }
      `}</style>
    </div>
  );
}

export function HealthTipsSection() {
  const tips = [
    { icon: 'fas fa-heart-pulse', title: 'Heart Health Tips', excerpt: 'Learn the essential habits to keep your heart strong and healthy every day.', category: 'Cardiology', color: '#EF4444' },
    { icon: 'fas fa-stethoscope', title: 'Regular Checkups', excerpt: 'Why preventive screenings are the key to long-term wellness and early detection.', category: 'Checkup', color: '#14B8A6' },
    { icon: 'fas fa-apple-alt', title: 'Nutrition Guide', excerpt: 'Expert advice on building a balanced diet for sustained energy and vitality.', category: 'Nutrition', color: '#06B6D4' },
  ];

  return (
    <section className="section-pad" style={{ background: 'var(--bg-primary)', borderTop: '1px solid #E2E8F0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ color: '#0F2D52' }}>Health Tips</h2>
          <div className="section-divider" style={{ margin: '12px auto 16px', background: '#14B8A6', width: '60px', height: '4px', borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {tips.map((tip, i) => (
            <div key={i} style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2rem',
              boxShadow: '0 4px 12px rgba(15, 45, 82, 0.05)', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#14B8A6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#E2E8F0'; }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: `${tip.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <i className={tip.icon} style={{ fontSize: '1.2rem', color: tip.color }}></i>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0F2D52', marginBottom: '8px' }}>{tip.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1rem' }}>{tip.excerpt}</p>
              <span style={{ color: '#14B8A6', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Learn More →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return visible ? (
    <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: '#14B8A6', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }}>
      <i className="fas fa-chevron-up"></i>
    </button>
  ) : null;
}

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const totalHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return <div style={{ position: 'fixed', top: 0, left: 0, height: '3px', background: '#14B8A6', width: `${progress}%`, zIndex: 9999, transition: 'width 0.1s ease' }}></div>;
}

export default function Footer({ onBook, onPortal }: { onBook: () => void; onPortal: () => void }) {
  const quickLinks = [
    { name: 'Departments', target: 'services' },
    { name: 'Find a Doctor', target: 'doctors' },
    { name: 'Book Appointment', action: onBook },
    { name: 'Cancellation', target: 'contact' },
    { name: 'Patient Feedback', target: 'contact' },
  ];

  const services = [
    { name: 'Emergency Care', target: 'services' },
    { name: 'Lab & Diagnostics', target: 'services' },
    { name: 'Pharmacy', target: 'services' },
    { name: 'Health Packages', target: 'services' },
    { name: 'Telemedicine', target: 'services' },
    { name: 'Ambulance', target: 'services' },
  ];

  const handleLinkClick = (link: any) => {
    if (link.action) {
      link.action();
    } else if (link.target) {
      const el = document.getElementById(link.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="contact" className="footer-section" style={{ background: '#0F2D52', color: 'white' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <img src={havedaLogo} alt="Haveda Hospital Logo" style={{ height: '36px', display: 'block' }} />
            </div>
            <p className="footer-logo-desc" style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)', marginBottom: '0.75rem', maxWidth: '300px' }}>
              Combining compassionate care with advanced medicine. NABH accredited with 20+ years of excellence in healthcare.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: 'facebook-f', link: '#' },
                { icon: 'instagram', link: '#' },
                { icon: 'twitter', link: '#' },
                { icon: 'youtube', link: '#' }
              ].map((social, i) => (
                <div key={i} style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', transition: 'background 0.2s', fontSize: '1.1rem' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0F766E')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#14B8A6')}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer-col-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {quickLinks.map(link => (
                <li key={link.name} style={{ marginBottom: '8px' }}>
                  <span 
                    onClick={() => handleLinkClick(link)}
                    style={{ 
                      fontSize: '0.9rem', 
                      color: 'rgba(255,255,255,0.7)', 
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#14B8A6')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {services.map(link => (
                <li key={link.name} style={{ marginBottom: '8px' }}>
                  <span 
                    onClick={() => handleLinkClick(link)}
                    style={{ 
                      fontSize: '0.9rem', 
                      color: 'rgba(255,255,255,0.7)', 
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#14B8A6')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Contact Us</h4>
            <div className="footer-contact" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#14B8A6', marginTop: '4px', fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                  123 Health Street,<br />Care City, HC 12345
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <i className="fas fa-phone-alt" style={{ color: '#14B8A6', marginTop: '2px', fontSize: '1.1rem' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>+1 234 567 8900</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>+1 234 567 8901</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <i className="fas fa-envelope" style={{ color: '#14B8A6', marginTop: '2px', fontSize: '1.1rem' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>info@havedahospital.com</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>support@havedahospital.com</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <i className="fas fa-clock" style={{ color: '#14B8A6', marginTop: '2px', fontSize: '1.1rem' }}></i>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Mon–Sun: 24 Hours</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Emergency: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
          <span>© 2026 Haveda Hospital. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>NABH Accreditation</span>
          </div>
        </div>
      </div>
      <style>{`
        .footer-section { padding-top: 1rem; }
        .footer-grid { gap: 1rem; padding-bottom: 1rem; }
        
        @media (max-width: 768px) {
          .footer-section { padding-top: 1.5rem; }
          .footer-grid { gap: 1.5rem; padding-bottom: 1.5rem; }
          .footer-logo-desc { margin-bottom: 1rem !important; }
          .footer-col-title { margin-bottom: 0.75rem !important; }
          .footer-contact { gap: 0.75rem !important; }
          .footer-bottom { 
            padding: 1rem 0 !important; 
            flex-direction: column; 
            align-items: center; 
            gap: 1rem; 
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
