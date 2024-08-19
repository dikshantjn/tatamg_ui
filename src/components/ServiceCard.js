import React from 'react';
import './ServiceCard.css'; // Include CSS if needed for styling

function ServiceCard({ title, description }) {
    return (
        <div className="service-card">
            <div className="icon"> {/* Placeholder for image/icon */}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export default ServiceCard;
