import React, { useState, useEffect, useCallback } from 'react';
import './Testimonials.css'; // Include CSS
import female1 from '../assets/Testimonial female face 1.jpg';
import male1 from '../assets/Testimonial male face 1.jpg';
import female2 from '../assets/Testimonial female face 2.jpg';
import male2 from '../assets/Testimonial male face 3.jpg';

function Testimonials() {
  const testimonialsData = [
    {
      name: 'Dr. Sarah Johnson',
      designation: 'Senior Healthcare Advisor, MBBS, MD',
      text: 'With over 15 years of experience in healthcare consulting, I\'ve seen how this platform revolutionizes access to quality medical care. The integration of technology with healthcare delivery is truly remarkable.',
      image: female1,
    },
    {
      name: 'Dr. Michael Chen',
      designation: 'Medical Technology Advisor, MD, MPH',
      text: 'The platform\'s commitment to patient safety and data security is exemplary. Their innovative approach to telemedicine and healthcare delivery sets new standards in the industry.',
      image: male1,
    },
    {
      name: 'Dr. Priya Sharma',
      designation: 'Wellness & Preventive Care Advisor, MBBS, DNB',
      text: 'What sets this platform apart is its holistic approach to healthcare. From preventive care to specialized treatments, the comprehensive coverage ensures patients receive the best possible care.',
      image: female2,
    },
    {
      name: 'Dr. James Wilson',
      designation: 'Healthcare Policy Advisor, MD, PhD',
      text: 'The platform\'s ability to connect patients with specialized care while maintaining affordability is impressive. Their focus on quality and accessibility makes healthcare more democratic.',
      image: male2,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  const handleNextClick = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
  }, [testimonialsData.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Auto-scroll functionality
  useEffect(() => {
    let intervalId;

    if (!isAutoScrollPaused) {
      intervalId = setInterval(() => {
        handleNextClick();
      }, 5000); // Change testimonial every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoScrollPaused, handleNextClick]);

  return (
    <section 
      className="testimonials"
      onMouseEnter={() => setIsAutoScrollPaused(true)}
      onMouseLeave={() => setIsAutoScrollPaused(false)}
      onTouchStart={() => setIsAutoScrollPaused(true)}
      onTouchEnd={() => setIsAutoScrollPaused(false)}
    >
      <h2>Our Healthcare Advisors</h2>
      <div className="testimonial-wrapper">
        <div className="testimonial" key={currentIndex}>
          <img src={testimonialsData[currentIndex].image} alt={`${testimonialsData[currentIndex].name}`} className="testimonial-img" />
          <p className="testimonial-text">"{testimonialsData[currentIndex].text}"</p>
          <h3>{testimonialsData[currentIndex].name}</h3>
          <p>{testimonialsData[currentIndex].designation}</p>
        </div>
      </div>

      <div className="arrows">
        <button className="arrow-left" onClick={handlePrevClick}>‹</button>
        <button className="arrow-right" onClick={handleNextClick}>›</button>
      </div>

      <div className="dots">
        {testimonialsData.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;


