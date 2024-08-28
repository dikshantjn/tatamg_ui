import React from 'react';
import { Link } from 'react-router-dom';
import './SearchByHealthConcern.css';
import pregnancyImg from '../assets/pregnant.png'; // Adjust the paths as necessary
import acneImg from '../assets/gallery.png';
import coldImg from '../assets/running-nose.png';

function SearchByHealthConcern() {
    const concerns = [
        {
            title: 'Pregnancy',
            description: 'Get the best advice and care during your pregnancy.',
            image: pregnancyImg,
        },
        {
            title: 'Acne',
            description: 'Learn how to manage and treat acne effectively.',
            image: acneImg,
        },
        {
            title: 'Cold',
            description: 'Tips and treatments for managing the common cold.',
            image: coldImg,
        },
    ];

    return (
        <section className="search-health-concern">
            <div className="heading-with-link">
                <h2>Search by health concern</h2>
                <Link to="/search" className="view-all-link">View All</Link>
            </div>
            <div className="concerns">
                {concerns.map(concern => (
                    <div className="concern" key={concern.title}>
                        <img src={concern.image} alt={concern.title} className="concern-image" />
                        <h3>{concern.title}</h3>
                        <p>{concern.description}</p>
                        <Link to={`/search-results?concern=${concern.title}`}>Learn more →</Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SearchByHealthConcern;
