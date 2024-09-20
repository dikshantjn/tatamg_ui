import React from 'react';
import { Link } from 'react-router-dom';
import './SearchByHealthConcern.css';
import brand1 from '../assets/brand_1.png'; // Adjust the paths as necessary
import brand2 from '../assets/brand_2.png';
import brand3 from '../assets/brand_3.png';
import brand4 from '../assets/brand_4.png';
import brand5 from '../assets/brand_5.png';


function SearchByBrand() {
    const concerns = [
        {
            title: 'Brand 1',
            description: '',
            image: brand1,
        },
        {
            title: 'Brand 2',
            description: '',
            image: brand2,
        },
        {
            title: 'Brand 3',
            description: '',
            image: brand3,
        },
        {
            title: 'brand 4',
            description: '',
            image: brand4,
        },
        {
            title: 'brand 5',
            description: '',
            image: brand5,
        },
    ];

    return (
        <section className="search-health-concern">
            <div className="heading-with-link">
                <h2>Search by Brands</h2>
                <Link to="/search" className="view-all-link">View All</Link>
            </div>
            <div className="concerns">
                {concerns.map(concern => (
                    <div className="concern" key={concern.title}>
                        <img src={concern.image} alt={concern.title} className="concern-image" />
                        <h3>{concern.title}</h3>
                        <p>{concern.description}</p>
                        {/* <Link to={`/search-results?concern=${concern.title}`}>Learn more →</Link> */}
                        <Link to="/search">Learn more →</Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SearchByBrand;
