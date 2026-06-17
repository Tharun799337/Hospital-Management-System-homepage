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
    <section id="health-packages" className="health-packages-section section-pad" style={{ background: 'linear-gradient(135deg, #f8fafc, #eff6ff)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(61,140,140,0.1)', color: 'var(--teal)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
            <i className="fas fa-box-open" style={{ marginRight: '0.5rem' }}></i> Our Premium Offerings
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '0.5rem' }}>
            Comprehensive Health Packages
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Preventive care tailored for you. Choose from our specialized health checkup packages to stay on top of your well-being.
          </p>
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
                  border: activeCategory === cat ? '1.5px solid var(--teal)' : '1.5px solid var(--border-color)',
                  background: activeCategory === cat ? 'var(--teal)' : 'var(--card-bg)',
                  color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
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
                    width: '40px', height: '40px', borderRadius: '10px', background: 'var(--blue-light)',
                    color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <i className={pkg.icon || 'fas fa-heartbeat'} style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3, marginTop: '0.1rem' }}>
                    {pkg.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.75rem', lineHeight: 1.4, flexGrow: 1 }}>
                  {pkg.description}
                </p>
                
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <strong style={{ fontSize: '0.7rem', color: 'var(--navy)', display: 'block', marginBottom: '0.2rem' }}>Tests Included:</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0, lineHeight: 1.3 }}>{pkg.tests_included}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: 'auto' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'Playfair Display, serif' }}>₹{pkg.price}</div>
                  <button style={{ backgroundColor: 'var(--navy)', color: 'white', padding: '0.45rem 1rem', fontSize: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
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
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }

        .package-card {
          flex: 0 0 calc(33.333% - 1rem);
          max-width: 340px;
          min-width: 280px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(20, 184, 166, 0.25);
          border-color: var(--teal);
          z-index: 10;
        }

        @media (max-width: 992px) {
          .package-card {
            flex: 0 0 calc(50% - 0.75rem);
          }
        }
        
        @media (max-width: 768px) {
          .package-card {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HealthPackagesSection;
