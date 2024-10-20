import React, { useState } from 'react';
import './Ayurveda.css';
import Testimonials from './Testimonials'; // Import Testimonials
import bannerImage from '../assets/Ayurveda Banner Photo.jpg'; // Placeholder for banner

import panchakarma from '../assets/Ayurveda Panchakarma.jpg'; // Placeholder for banner
import detoxification from '../assets/Ayurveda Detoxification.jpg'; // Placeholder for banner
import weightManagement from '../assets/Ayurveda Weight Management.jpg'; // Placeholder for banner
import rejuvenation from '../assets/Ayurveda Rejuvenation.jpg';
import painManagement from '../assets/Ayurveda Pain management.jpg'; // Placeholder for banner

import oil from '../assets/Ayurveda Oil.jpg';
import medicine from '../assets/Ayurveda Medicine.jpg';
import tea from '../assets/Ayurveda Tea.jpg'; // Array of product images

const treatmentOptions = [
  { name: 'Panchakarma', image: panchakarma },
  { name: 'Detoxification', image: detoxification },
  { name: 'Weight Management', image: weightManagement },
  { name: 'Rejuvenation', image: rejuvenation },
  { name: 'Pain Management', image: painManagement },
];

const productOptions = [
  { name: 'Oil', description: 'Natural oils for relaxation and healing', image: oil },
  { name: 'Medicine', description: 'Ayurvedic medicines for various ailments', image: medicine },
  { name: 'Tea', description: 'Herbal teas for detoxification and health', image: tea }
];

function Ayurveda() {
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = (treatment) => {
    setSelectedTreatment(treatment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="ayurveda-page">
      {/* Banner Section */}
      <section className="banner">
        <img src={bannerImage} alt="Ayurveda Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Experience the Healing Power of Ayurveda</h1>
          <p>Explore our treatments and products for better health and well-being.</p>
        </div>
      </section>

      {/* Ayurveda Treatments */}
      <section className="ayurveda-treatments">
        <h2>Ayurveda Treatments</h2>
        <div className="treatment-cards">
          {treatmentOptions.map((treatment, index) => (
            <div key={index} className="treatment-card">
              <img src={treatment.image} alt={treatment.name} className="treatment-image" />
              <h3>{treatment.name}</h3>
              <button onClick={() => handleOpenForm(treatment.name)}>Book Appointment</button>
            </div>
          ))}
        </div>
      </section>

      {/* Ayurveda Products */}
      <section className="ayurveda-products">
        <h2>Ayurveda Products</h2>
        <div className="horizontal-scroll">
          {productOptions.map((product, index) => (
            <div key={index} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <button>View</button>
            </div>
          ))}
        </div>
      </section>

      {/* Form Modal */}
      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseForm}>&times;</span>
            <h2>Book An Appointment for {selectedTreatment}</h2>
            <form>
              <label>Name:</label>
              <input type="text" placeholder="Enter your name" required />

              <label>Mobile Number:</label>
              <input type="tel" placeholder="Enter your mobile number" required />

              <label>Email ID:</label>
              <input type="email" placeholder="Enter your email" required />

              <label>Age:</label>
              <input type="number" placeholder="Enter your age" required />

              <label>Location:</label>
              <input type="text" placeholder="Enter your location" required />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Ayurveda;
