import React from 'react';

export default function FeaturesSection() {
  const features = [
    { icon: 'fas fa-stethoscope', title: 'Expert Doctors', subtitle: 'Highly qualified and experienced specialists' },
    { icon: 'fas fa-microscope', title: 'Advanced Care', subtitle: 'State-of-the-art technology for accurate diagnosis' },
    { icon: 'fas fa-shield-alt', title: 'Patient Safety', subtitle: 'Your safety and well-being are our top priorities' },
    { icon: 'fas fa-clock', title: '24/7 Support', subtitle: 'Round-the-clock care whenever you need us' }
  ];

  return (
    <section style={{ padding: '30px 5%', background: '#F8FFFE' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '22px',
        width: '100%'
      }}>
        {features.map((f, i) => (
          <div key={i} className="health-tip-card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'auto', /* override the 280px min-width so grid handles it */
            padding: '26px 22px',
            background: '#ffffff',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)', /* Increased light-black shadow for separation */
            border: '1px solid rgba(0, 0, 0, 0.04)' /* Subtle border for separation */
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '14px',
              boxShadow: '0 4px 10px rgba(20, 184, 166, 0.3)'
            }}>
              <i className={f.icon}></i>
            </div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 800, color: '#0F2D52' }}>
              {f.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: '#4C6582' }}>
              {f.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
