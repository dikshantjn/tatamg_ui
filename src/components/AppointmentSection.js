import React from 'react';
import { Link } from 'react-router-dom';
import './AppointmentSection.css'; // Include CSS if needed for styling
import dietianImg from '../assets/healthy-menu-recipe-food-diet.jpg'; // Adjust the paths as necessary
import physiotherapistImg from '../assets/phsiotherapist.jpg';
import surgeonImg from '../assets/surgeon.jpg';
import dentistImg from '../assets/dentist.jpg';

function AppointmentSection() {
    const appointments = [
        { title: 'Dietition', img: dietianImg },
        { title: 'Physiotherapist', img: physiotherapistImg },
        { title: 'General Surgeon', img: surgeonImg },
        { title: 'Dentist', img: dentistImg }
    ];

    return (
        <section className="appointment-section">
            <div className="heading-with-link">
                <h2>Book an appointment for in person consultation</h2>
                <Link to="/search" className="view-all-link">View All</Link>
            </div>
            <div className="appointments">
                {appointments.map(appointment => (
                    <div className="appointment" key={appointment.title}>
                        <img src={appointment.img} alt={appointment.title} />
                        <h3>{appointment.title}</h3>
                        <a href="#">Learn more →</a>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AppointmentSection;
