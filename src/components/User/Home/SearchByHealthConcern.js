import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchByHealthConcern.css';
import pregnancyImg from '../../../assets/pregnant.png';
import acneImg from '../../../assets/acne.png';
import coldImg from '../../../assets/cold.png';
import diabetesImg from '../../../assets/diabetes-test.png';
import liverImg from '../../../assets/liver.png';

function SearchByHealthConcern() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            handleScroll();
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Simplified navigation without auth check
    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

    const concerns = [
        {
            title: 'Pregnancy Care',
            description: 'Expert guidance and care throughout your pregnancy journey',
            image: pregnancyImg,
            link: '/search?concern=pregnancy',
            color: '#EC4899'
        },
        {
            title: 'Skin Care',
            description: 'Professional treatment for acne and skin conditions',
            image: acneImg,
            link: '/search?concern=skin',
            color: '#8B5CF6'
        },
        {
            title: 'Cold & Flu',
            description: 'Relief from cold, cough, and flu symptoms',
            image: coldImg,
            link: '/search?concern=cold',
            color: '#3B82F6'
        },
        {
            title: 'Diabetes Care',
            description: 'Comprehensive diabetes management and support',
            image: diabetesImg,
            link: '/search?concern=diabetes',
            color: '#10B981'
        },
        {
            title: 'Liver Health',
            description: 'Specialized care for liver conditions and wellness',
            image: liverImg,
            link: '/search?concern=liver',
            color: '#F59E0B'
        },
    ];

    return (
        <section className="search-health-concern">
            <div className="section-header">
                <div className="header-content">
                    <h4>Search by Health Concern</h4>
                    <a href="/search" className="view-all-button" onClick={(e) => handleNavigation('/search', e)}>
                        View All Concerns
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="concerns-container">
                {showLeftButton && (
                    <button 
                        className="scroll-button scroll-left" 
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                )}

                <div className="concerns-grid" ref={scrollRef}>
                    {concerns.map((concern, index) => (
                        <div 
                            className="concern-card" 
                            key={concern.title}
                            style={{ '--card-color': concern.color }}
                        >
                            <div className="card-content">
                                <div className="concern-icon-wrapper">
                                    <img 
                                        src={concern.image} 
                                        alt={concern.title} 
                                        className="concern-icon"
                                    />
                                </div>
                                <div className="concern-details">
                                    <h3>{concern.title}</h3>
                                    <p>{concern.description}</p>
                                </div>
                                <a href={concern.link} className="concern-link" onClick={(e) => handleNavigation(concern.link, e)}>
                                    Explore Solutions
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                                    </svg>
                                </a>
                            </div>
                            <div className="card-background">
                                <div className="geometric-shape"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {showRightButton && (
                    <button 
                        className="scroll-button scroll-right" 
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                )}
            </div>
        </section>
    );
}

export default SearchByHealthConcern;
