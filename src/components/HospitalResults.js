import React from 'react';
import { useLocation } from 'react-router-dom';
import './HospitalResults.css';

function HospitalResults() {
  const location = useLocation();
  const { formData } = location.state || { formData: { illness: '', location: '' } }; // Handle no form data case

  const hospitals = [
    { name: 'City Heart Hospital', address: '123 Main St, City', specialization: 'Cardiology' },
    { name: 'Dental Care Clinic', address: '456 Maple Ave, City', specialization: 'Dental' },
    { name: 'Neuro Center', address: '789 Oak Blvd, City', specialization: 'Neurology' },
    // Add more hospitals
  ];

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.specialization === formData.illness &&
      hospital.address.includes(formData.location)
  );

  return (
    <div className="hospital-results-page">
      <h1>Hospitals for {formData.illness} in {formData.location}</h1>
      <ul className="hospital-list">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital, index) => (
            <li key={index} className="hospital-item">
              <h3>{hospital.name}</h3>
              <p>{hospital.address}</p>
              <p>Specialization: {hospital.specialization}</p>
            </li>
          ))
        ) : (
          <p>No hospitals found for the selected criteria.</p>
        )}
      </ul>
    </div>
  );
}

export default HospitalResults;
