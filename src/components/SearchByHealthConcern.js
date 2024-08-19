import React from 'react';
import './SearchByHealthConcern.css'; // Include CSS if needed for styling

function SearchByHealthConcern() {
    const concerns = [
        { title: 'Pregnancy', description: 'Lorem ipsum dolor sit amet...' },
        { title: 'Acne', description: 'Lorem ipsum dolor sit amet...' },
        { title: 'Cold', description: 'Lorem ipsum dolor sit amet...' }
    ];

    return (
        <section className="search-health-concern">
            <h2>Search by health concern</h2>
            <div className="concerns">
                {concerns.map(concern => (
                    <div className="concern" key={concern.title}>
                        <div className="icon"></div>
                        <h3>{concern.title}</h3>
                        <p>{concern.description}</p>
                        <a href="#">Learn more →</a>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SearchByHealthConcern;
