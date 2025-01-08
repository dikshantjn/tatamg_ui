import React, { useState } from "react";
import "./PaymentGateway.css";

function PaymentGateway() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        bank: "",
    });

    const banks = ["SBI", "HDFC", "ICICI", "Axis Bank", "Kotak Mahindra"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Payment details submitted successfully!");
        console.log(formData);
    };

    return (
        <div className="payment-gateway">
            <h1>Payment Gateway</h1>
            <form className="payment-form" onSubmit={handleSubmit}>
                {/* User Details Section */}
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                    />
                </div>

                {/* Card Details Section */}
                <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="Enter your card number"
                        maxLength="16"
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="month"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="password"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            placeholder="CVV"
                            maxLength="3"
                            required
                        />
                    </div>
                </div>

                {/* Bank Options Section */}
                <div className="form-group">
                    <label htmlFor="bank">Select Bank</label>
                    <select
                        id="bank"
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select a Bank --</option>
                        {banks.map((bank, index) => (
                            <option key={index} value={bank}>
                                {bank}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                    Pay Now
                </button>
            </form>
        </div>
    );
}

export default PaymentGateway;
