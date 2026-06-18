import React, { useEffect, useState, useMemo } from 'react';
import { fetchPackages } from '../api';

const getCategory = (pkg: any) => {
  const n = pkg.name?.toLowerCase() || '';
  if (n.includes('basic') || n.includes('cbp')) return 'Basic';
  if (n.includes('advanced') || n.includes('cardiac')) return 'Advanced';
  if (n.includes('senior')) return 'Senior Care';
  if (n.includes('diabetic') || n.includes('special')) return 'Specialized';
  return 'General';
};

const HealthPackagesSection: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');

  useEffect(() => {
    fetchPackages().then(data => {
      if (data && data.length > 0) setPackages(data);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    packages.forEach(p => Object.keys(p).length > 0 && cats.add(getCategory(p)));
    return Array.from(cats);
  }, [packages]);

  const filteredPackages = useMemo(() => {
    let result = [...packages];
    if (activeCategory !== 'All') {
      result = result.filter(p => getCategory(p) === activeCategory);
    }
    
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    
    return result;
  }, [packages, activeCategory, sortBy]);

  if (packages.length === 0) return null;

  return (
    <section id="health-packages" style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: '#d97706', letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Our Premium Offerings</p>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#1b3560', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Comprehensive <span style={{ color: '#d97706' }}>Health Packages</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                  border: activeCategory === cat ? '1.5px solid #1b3560' : '1.5px solid rgba(27,53,96,0.12)',
                  background: activeCategory === cat ? '#1b3560' : 'white',
                  color: activeCategory === cat ? 'white' : '#64748b',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-color)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="packages-grid">
          {filteredPackages.length > 0 ? filteredPackages.map((pkg, i) => (
            <div key={`${pkg.id}-${i}`} className="package-card">
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: '#fef3c7',
                    color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <i className={pkg.icon || 'fas fa-heartbeat'} style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <h3 style={{ fontFamily: 'Inter, DM Sans, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3, marginTop: '0.1rem', letterSpacing: '-0.01em' }}>
                    {pkg.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.75rem', lineHeight: 1.4, flexGrow: 1 }}>
                  {pkg.description}
                </p>
                
                <div style={{ background: 'white', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', border: '1.5px solid rgba(27,53,96,0.08)' }}>
                  <strong style={{ fontSize: '0.7rem', color: '#1b3560', display: 'block', marginBottom: '0.2rem' }}>Tests Included:</strong>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0, lineHeight: 1.3 }}>{pkg.tests_included}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(27,53,96,0.08)', paddingTop: '0.8rem', marginTop: 'auto' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', fontFamily: 'Inter, DM Sans, sans-serif', letterSpacing: '-0.02em' }}>₹{pkg.price}</div>
                  <button
                    style={{ backgroundColor: '#1b3560', color: 'white', padding: '0.45rem 1rem', fontSize: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Book <i className="fas fa-arrow-right" style={{ marginLeft: '0.4rem' }}></i>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-box-open" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.3 }}></i>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No packages found matching your filters.</p>
              <button onClick={() => {setActiveCategory('All'); setSortBy('Recommended');}} className="btn-primary" style={{ marginTop: '1rem' }}>
                <i className="fas fa-redo"></i> Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .package-card {
          background: #f8f9fc;
          border: 1.5px solid rgba(27, 53, 96, 0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(27, 53, 96, 0.12);
          border-color: rgba(27, 53, 96, 0.2);
          z-index: 10;
        }

        @media (max-width: 1024px) {
          .packages-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .packages-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default HealthPackagesSection;
