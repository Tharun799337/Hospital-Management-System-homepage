import React, { useEffect, useState } from 'react';
import { fetchEvents, EventNews } from '../api';

export default function NewsSection() {
  const [news, setNews] = useState<EventNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(data => {
        // Fetch all news instead of just 3
        setNews(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load news', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const shouldAutoScroll = news.length > 4;
  // If auto-scrolling, duplicate the array so it scrolls seamlessly
  const displayNews = shouldAutoScroll ? [...news, ...news] : news;

  return (
    <section className="news-section" id="news" style={{ padding: '60px 0', background: '#f8fafc', overflow: 'hidden' }}>
      <style>{`
        .news-carousel-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }
        .news-track {
          display: flex;
          gap: 24px;
          width: max-content;
        }
        .news-track.centered {
          justify-content: center;
          width: 100%;
          flex-wrap: wrap;
        }
        .news-card-compact {
          width: 280px; /* Small and medium attractive size */
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(15, 45, 82, 0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          border: 1px solid rgba(226, 232, 240, 0.8);
          flex-shrink: 0;
        }
        .news-card-compact:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(15, 45, 82, 0.12);
        }
        .news-img-compact {
          height: 160px;
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .news-img-compact img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .news-card-compact:hover .news-img-compact img {
          transform: scale(1.08);
        }
        .news-content-compact {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .news-date-compact {
          font-size: 0.75rem;
          color: #14B8A6;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .news-title-compact {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f2d52;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-desc-compact {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .news-link-compact {
          font-size: 0.85rem;
          color: #14B8A6;
          font-weight: 600;
          text-decoration: none;
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s;
        }
        .news-link-compact i {
          font-size: 0.75rem;
        }
        .news-link-compact:hover {
          gap: 10px;
          color: #0d9488;
        }
        
        @keyframes autoScrollNews {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* Shift exactly half the track including gap */
        }
        
        .news-track.animate {
          animation: autoScrollNews 25s linear infinite;
        }
        .news-track.animate:hover {
          animation-play-state: paused; /* Pause on hover */
        }
      `}</style>

      <div className="container">
        <div className="section-head center">
          <span className="section-tag">LATEST NEWS</span>
          <h2 className="section-h2">Hospital News & Updates</h2>
          <p className="section-p" style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
            Stay updated with the latest healthcare innovations, medical camps,
            technology upgrades, and patient care initiatives at Haveda Hospital.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#64748b', padding: '40px 0' }}>Loading latest news...</p>
        ) : news.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#64748b', padding: '40px 0' }}>No news available at the moment.</p>
        ) : (
          <div className="news-carousel-container">
            <div className={`news-track ${shouldAutoScroll ? 'animate' : 'centered'}`}>
              {displayNews.map((item, index) => (
                <div className="news-card-compact" key={`${item.id}-${index}`}>
                  <div className="news-img-compact">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop"} 
                      alt={item.title} 
                    />
                  </div>
                  <div className="news-content-compact">
                    <span className="news-date-compact">{formatDate(item.datetime)}</span>
                    <h3 className="news-title-compact">{item.title}</h3>
                    <p className="news-desc-compact">{item.description}</p>
                    <a href="#" className="news-link-compact">
                      Read More <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
