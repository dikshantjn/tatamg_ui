import React, { useState } from 'react';
import './Testimonials.css'; // Include CSS
import female1 from '../assets/Testimonial female face 1.jpg';
import male1 from '../assets/Testimonial male face 1.jpg';
import female2 from '../assets/Testimonial female face 2.jpg';
import male2 from '../assets/Testimonial male face 3.jpg';

function Testimonials() {
  const testimonialsData = [
    {
      name: 'Adam Smith',
      designation: 'CEO, Company',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: male1, // Replace with actual image path
    },
    {
      name: 'Jane Doe',
      designation: 'Marketing Manager',
      text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      image: female1,
    },
    {
      name: 'John Brown',
      designation: 'Senior Developer',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
      image: male2,
    },
    {
      name: 'Emily White',
      designation: 'Product Designer',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse...',
      image: female2,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="testimonials">
      <h2>What Our Clients Say</h2>
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
