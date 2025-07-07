import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import findDoctorImg from '../../../assets/Find Doctors Near You.png';
import consultImg from '../../../assets/consult.jpg';
import { FaPhoneAlt, FaWhatsapp, FaPercent, FaGift, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ConsultDoctors.css';

const offers = [
  {
    icon: <FaPercent size={32} />,
    title: '20% Off First Consultation',
    desc: 'Get 20% off on your first online doctor consultation.',
    code: 'FIRST20',
    badge: '20% OFF',
    color: 'linear-gradient(135deg, #232b5d 60%, #4e54c8 100%)',
    badgeColor: 'linear-gradient(90deg, #ffd700 60%, #ffb300 100%)',
    badgeTextColor: '#232b5d',
  },
  {
    icon: <FaGift size={32} />,
    title: 'Free Follow-up',
    desc: 'Book now and get a free follow-up within 7 days.',
    code: 'FREEREVIEW',
    badge: 'FREE',
    color: 'linear-gradient(135deg, #232b5d 60%, #a770ef 100%)',
    badgeColor: 'linear-gradient(90deg, #ffd700 60%, #ffb300 100%)',
    badgeTextColor: '#232b5d',
  },
  {
    icon: <FaPercent size={32} />,
    title: 'Lab Test Discount',
    desc: 'Flat 15% off on lab tests with any doctor booking.',
    code: 'LAB15',
    badge: '15% OFF',
    color: 'linear-gradient(135deg, #232b5d 60%, #43cea2 100%)',
    badgeColor: 'linear-gradient(90deg, #ffd700 60%, #ffb300 100%)',
    badgeTextColor: '#232b5d',
  },
];

function ConsultDoctors() {
  const offersListRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const navigate = useNavigate();

  const scrollOffers = (direction) => {
    const node = offersListRef.current;
    if (!node) return;
    const cardWidth = node.firstChild ? node.firstChild.offsetWidth + 18 : 300;
    const maxScroll = (offers.length - 1) * cardWidth;
    let newScroll = node.scrollLeft + direction * cardWidth;
    if (newScroll < 0) newScroll = 0;
    if (newScroll > maxScroll) newScroll = maxScroll;
    node.scrollTo({ left: newScroll, behavior: 'smooth' });
    setScrollIndex(Math.round(newScroll / cardWidth));
  };

  return (
    <div className="consult-options-container">
      <div className="consult-options-row">
        <div
          className="consult-option-card find-doctor"
          onClick={() => navigate('/doctor-consultation/offline')}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor-consultation/offline'); }}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-icon-section">
            <div className="icon-wrapper">
              <img src={findDoctorImg} alt="Find Doctor Near You" className="card-icon" />
            </div>
            <div className="count-badge">
              <span className="count-number">2,847</span>
              <span className="count-label">Doctors</span>
            </div>
          </div>
          
          <div className="card-content-section">
            <div className="card-header">
              <h2 className="card-title">Find Doctor Near You</h2>
              <p className="card-description">Book appointments with top doctors in your area</p>
            </div>
            
            <div className="card-features">
              <div className="feature-tag">
                <span className="feature-icon">📍</span>
                <span>Nearby Locations</span>
              </div>
              <div className="feature-tag">
                <span className="feature-icon">⭐</span>
                <span>Top Rated</span>
              </div>
              <div className="feature-tag">
                <span className="feature-icon">🕒</span>
                <span>Same Day</span>
              </div>
            </div>
            
            <div className="card-action">
              <span className="action-text">Find Now</span>
              <span className="action-arrow">→</span>
            </div>
          </div>
        </div>
        
        <div
          className="consult-option-card online-consult"
          onClick={() => navigate('/doctor-consultation/online')}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor-consultation/online'); }}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-icon-section">
            <div className="icon-wrapper">
              <img src={consultImg} alt="Online Doctor Consultation" className="card-icon" />
            </div>
            <div className="count-badge">
              <span className="count-number">1,234</span>
              <span className="count-label">Online</span>
            </div>
          </div>
          
          <div className="card-content-section">
            <div className="card-header">
              <h2 className="card-title">Online Doctor Consultation</h2>
              <p className="card-description">Instant video or chat with certified doctors</p>
            </div>
            
            <div className="card-features">
              <div className="feature-tag">
                <span className="feature-icon">📹</span>
                <span>HD Video Call</span>
              </div>
              <div className="feature-tag">
                <span className="feature-icon">⚡</span>
                <span>Instant Connect</span>
              </div>
              <div className="feature-tag">
                <span className="feature-icon">🛡️</span>
                <span>Secure & Private</span>
              </div>
            </div>
            
            <div className="card-action">
              <span className="action-text">Consult Now</span>
              <span className="action-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
      <div className="or-section">
        <span className="or-line"></span>
        <span className="or-text">OR</span>
        <span className="or-line"></span>
      </div>
      <div className="contact-buttons">
        <a href="tel:+911234567890" className="contact-btn call-btn">
          <FaPhoneAlt size={20} /> Call
        </a>
        <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
          <FaWhatsapp size={22} /> WhatsApp
        </a>
      </div>
      <div className="offers-section">
        <h3 className="offers-title">Special Offers</h3>
        <div className="offers-scrollbar">
          <button className="offers-arrow left" onClick={() => scrollOffers(-1)} aria-label="Scroll left">
            <FaChevronLeft />
          </button>
          <div className="offers-list" ref={offersListRef}>
            {offers.map((offer, idx) => (
              <div
                className="offer-coupon premium"
                style={{ background: offer.color }}
                key={idx}
              >
                <div
                  className="coupon-badge premium"
                  style={{ background: offer.badgeColor, color: offer.badgeTextColor }}
                >
                  {offer.badge}
                </div>
                <div className="coupon-content">
                  <div className="offer-icon">{offer.icon}</div>
                  <div className="offer-info">
                    <div className="offer-title">{offer.title}</div>
                    <div className="offer-desc">{offer.desc}</div>
                    <div className="coupon-footer">
                      <span className="coupon-code premium">{offer.code}</span>
                      <button className="use-now-btn premium">Use Now</button>
                    </div>
                  </div>
                </div>
                <div className="coupon-dots coupon-dots-left premium"></div>
                <div className="coupon-dots coupon-dots-right premium"></div>
              </div>
            ))}
          </div>
          <button className="offers-arrow right" onClick={() => scrollOffers(1)} aria-label="Scroll right">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsultDoctors;
