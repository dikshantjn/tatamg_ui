import React, { useState } from 'react';
import './Testimonials.css'; // Include CSS

function Testimonials() {
  const testimonialsData = [
    {
      name: 'Adam Smith',
      designation: 'CEO, Company',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      image: 'placeholder.png', // Replace with actual image path
    },
    {
      name: 'Jane Doe',
      designation: 'Marketing Manager',
      text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      image: 'placeholder.png',
    },
    {
      name: 'John Brown',
      designation: 'Senior Developer',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
      image: 'placeholder.png',
    },
    {
      name: 'Emily White',
      designation: 'Product Designer',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse...',
      image: 'placeholder.png',
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
