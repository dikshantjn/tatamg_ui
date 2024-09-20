import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // To get loanName from the previous page
import './LoanForm.css';

function LoanForm() {
  const location = useLocation();
  const { loanName } = location.state || {}; // Get the loanName passed from MedicalLoans.js

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    incomeSource: '',
    loanAmount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., sending data to the backend)
    console.log(formData);
    alert('Your loan application has been submitted.');
  };

  return (
    <div className="loan-form-page">
      <h1>Apply for {loanName} Loan</h1>
      
      {/* Loan Application Form */}
      <form className="loan-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
          />
        </div>
        <div className="form-group">
          <label>Email ID:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Nature of Income:</label>
          <input
            type="text"
            name="incomeSource"
            value={formData.incomeSource}
            onChange={handleChange}
            placeholder="Enter your income source"
            required
          />
        </div>
        <div className="form-group">
          <label>Loan Amount Required:</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Enter the loan amount"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default LoanForm;
