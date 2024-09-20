import React from 'react';
import { Link } from 'react-router-dom';
import './SearchByHealthConcern.css';
import pregnancyImg from '../assets/pregnant.png'; // Adjust the paths as necessary
import acneImg from '../assets/acne.png';
import coldImg from '../assets/cold.png';
import diabetesImg from '../assets/diabetes-test.png';
import liverImg from '../assets/liver.png';


function SearchByHealthConcern() {
    const concerns = [
        {
            title: 'Pregnancy',
            description: '',
            image: pregnancyImg,
        },
        {
            title: 'Acne',
            description: '',
            image: acneImg,
        },
        {
            title: 'Cold',
            description: '',
            image: coldImg,
        },
        {
            title: 'Diabetes',
            description: '',
            image: diabetesImg,
        },
        {
            title: 'Liver Care',
            description: '',
            image: liverImg,
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
                        {/* <Link to={`/search-?concern=${concern.title}`}>Learn more →</Link> */}
                        <Link to="/search">Learn more →</Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SearchByHealthConcern;
