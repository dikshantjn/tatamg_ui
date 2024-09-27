import React from 'react';
import './ChildCare.css';
import Testimonials from './Testimonials';
// Placeholder imports for therapy icons
import therapyIcon1 from '../assets/therapy1.jpg';
import therapyIcon2 from '../assets/therapy2.jpg';
import therapyIcon3 from '../assets/therapy3.jpg';

function ChildCare() {
  return (
    <div className="child-care-page">
      {/* Introduction Section */}
      <section className="intro-section">
        <h1>Child Therapy for Developmental Challenges</h1>
        <p>Our child therapy sessions are designed to address developmental challenges that children may face, helping them to grow and thrive. Our experienced therapists work closely with children to provide customized therapy tailored to their unique needs.</p>
      </section>

      {/* Therapy Options Section */}
      <section className="therapy-options-section">
        <h2>Therapy Options for Children</h2>
        <div className="therapy-options">
          <div className="therapy-option">
            <img src={therapyIcon1} alt="Speech Therapy" />
            <h3>Speech Therapy</h3>
            <p>Helping children improve communication skills, articulation, and language comprehension through specialized speech therapy techniques.</p>
          </div>
          <div className="therapy-option">
            <img src={therapyIcon2} alt="Occupational Therapy" />
            <h3>Occupational Therapy</h3>
            <p>Assisting children in developing fine motor skills, hand-eye coordination, and daily living skills, improving independence and confidence.</p>
          </div>
          <div className="therapy-option">
            <img src={therapyIcon3} alt="Behavioral Therapy" />
            <h3>Behavioral Therapy</h3>
            <p>Addressing emotional and behavioral challenges through tailored therapy sessions, focusing on positive reinforcement and emotional regulation.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default ChildCare;
