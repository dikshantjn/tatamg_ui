import React from 'react';
import './AppointmentSection.css'; // Include CSS if needed for styling

function AppointmentSection() {
    const appointments = [
        { title: 'Dietition', img: '/Users/dikshantjain/Software_Development/Projects/tatamg_ui/src/assets/healthy-menu-recipe-food-diet.jpg' },
        { title: 'Physiotherapist', img: 'image_path' },
        { title: 'General Surgeon', img: 'image_path' },
        { title: 'Dentist', img: 'image_path' }
    ];

    return (
        <section className="appointment-section">
            <h2>Book an appointment for in person consultation</h2>
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
