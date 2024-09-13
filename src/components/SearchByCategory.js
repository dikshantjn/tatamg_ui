import React from 'react';
import { Link } from 'react-router-dom';
import './SearchByCategory.css';
import brand1 from '../assets/otc.jpg'; // Adjust the paths as necessary
import brand2 from '../assets/wearable.jpg';
import brand3 from '../assets/nonwearable.jpg';



function SearchByCategory() {
    const concerns = [
        {
            title: 'OTC',
            description: '',
            image: brand1,
        },
        {
            title: 'Wearable',
            description: '',
            image: brand2,
        },
        {
            title: 'Non-Wearable',
            description: '',
            image: brand3,
        },
    ];

    return (
        <section className="search-health-concern">
            <div className="heading-with-link">
                <h2>Search by Category</h2>
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

export default SearchByCategory;
