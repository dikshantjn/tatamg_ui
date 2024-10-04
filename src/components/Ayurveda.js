import React, { useState } from 'react';
import './Ayurveda.css';

const treatmentOptions = [
  'Panchakarma', 'Detoxification', 'Weight Management', 
  'Rejuvenation', 'Pain Management', 'All Treatment'
];

const productOptions = [
  { name: 'Oil', description: 'Natural oils for relaxation and healing' },
  { name: 'Medicine', description: 'Ayurvedic medicines for various ailments' },
  { name: 'Tea', description: 'Herbal teas for detoxification and health' }
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
      {/* Ayurveda Treatments */}
      <section className="ayurveda-treatments">
        <h2>Ayurveda Treatments</h2>
        <div className="treatment-cards">
          {treatmentOptions.map((treatment, index) => (
            <div key={index} className="treatment-card">
              <h3>{treatment}</h3>
              <button onClick={() => handleOpenForm(treatment)}>Book Appointment</button>
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
    </div>
  );
}

export default Ayurveda;
