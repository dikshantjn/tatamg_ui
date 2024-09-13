import React from 'react';
import './Membership.css'; // Create a CSS file to style the membership page

function Membership() {
    return (
        <div className="membership-page">
            <h2>Select Your Membership Plan</h2>

            <div className="membership-options">
                {/* Basic Plan */}
                <div className="membership-card">
                    <h3>Basic Plan</h3>
                    <p>Rs.1000/-</p>
                    <p>5% discount across all products and services.</p>
                    <button className="select-plan-btn">Select Basic</button>
                </div>

                {/* Premium Plan */}
                <div className="membership-card">
                    <h3>Premium Plan</h3>
                    <p>Rs.2500/-</p>
                    <p>7% discount across all products and services, free delivery.</p>
                    <button className="select-plan-btn">Select Premium</button>
                </div>

                {/* Elite Plan */}
                <div className="membership-card">
                    <h3>Elite Plan</h3>
                    <p>Rs.3500/-</p>
                    <p>10% discount across all products and services, free delivery.</p>
                    <p>First access to all new product launches, free ambulance service.</p>
                    <button className="select-plan-btn">Select Elite</button>
                </div>
            </div>
        </div>
    );
}

export default Membership;
