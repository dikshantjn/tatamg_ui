import React, { useState } from 'react';
import './ChildCare.css';
import Testimonials from './Testimonials';
// Placeholder imports for therapy icons and banner
import therapyIcon1 from '../assets/therapy1.jpg';
import therapyIcon2 from '../assets/therapy2.jpg';
import therapyIcon3 from '../assets/therapy3.jpg';
import bannerImage from '../assets/Child Care Banner Photo.jpg'; // Placeholder for banner image

function ChildCare() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="child-care-page">
      {/* Banner Section */}
      <section className="banner-section">
        <img src={bannerImage} alt="Child Care Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Comprehensive Child Therapy</h1>
          <button className="contact-us-btn" onClick={toggleForm}>
            Contact Us
          </button>
        </div>
      </section>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-form-overlay">
          <div className="popup-form">
            <h2>Contact Us for Child Therapy</h2>
            <form>
              <label>Name:</label>
              <input type="text" required />

              <label>Age:</label>
              <input type="number" required />

              <label>Gender:</label>
              <select required>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>

              <label>Concerns:</label>
              <select required>
                <option value="speaking">Speaking</option>
                <option value="eating">Eating</option>
                <option value="listening">Listening</option>
                <option value="behaviour">Behaviour</option>
                <option value="learning">Learning</option>
              </select>

              <label>Mobile Number:</label>
              <input type="tel" required />

              <label>Email ID:</label>
              <input type="email" required />

              <label>Location:</label>
              <input type="text" required />

              <button type="submit">Submit</button>
              <button type="button" onClick={toggleForm} className="close-btn">Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Introduction Section */}
      <section className="intro-section">
        <h1>Child Therapy for Developmental Challenges</h1>
        <p>Our child therapy sessions address developmental challenges to help children grow and thrive. Our experienced therapists provide customized therapy tailored to their unique needs.</p>
      </section>

      {/* Therapy Options Section */}
      <section className="therapy-options-section">
        <h2>Therapy Options for Children</h2>
        <div className="therapy-options">
          <div className="therapy-option">
            <img src={therapyIcon1} alt="Speech Therapy" />
            <h3>Speech Therapy</h3>
            <p>Helping children improve communication skills and language comprehension through specialized speech therapy techniques.</p>
          </div>
          <div className="therapy-option">
            <img src={therapyIcon2} alt="Occupational Therapy" />
            <h3>Occupational Therapy</h3>
            <p>Developing fine motor skills and daily living skills, improving independence and confidence.</p>
          </div>
          <div className="therapy-option">
            <img src={therapyIcon3} alt="Behavioral Therapy" />
            <h3>Behavioral Therapy</h3>
            <p>Addressing emotional and behavioral challenges through tailored therapy sessions, focusing on emotional regulation.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default ChildCare;
