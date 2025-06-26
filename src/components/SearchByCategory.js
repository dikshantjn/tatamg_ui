import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchByCategory.css';
import category1 from '../assets/category1.jpg';
import category2 from '../assets/category2.jpg';
import category3 from '../assets/category3.jpg';

function SearchByCategory() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();

    const categories = [
        {
            title: 'Medicines',
            image: category1,
            link: '/search?category=medicines',
            description: 'Prescription & OTC Medicines'
        },
        {
            title: 'Healthcare Devices',
            image: category2,
            link: '/search?category=healthcare-devices',
            description: 'BP Monitors, Glucometers & more'
        },
        {
            title: 'Personal Care',
            image: category3,
            link: '/search?category=personal-care',
            description: 'Skincare, Dental Care & more'
        },
        {
            title: 'Nutrition & Supplements',
            image: category1,
            link: '/search?category=nutrition-supplements',
            description: 'Vitamins, Proteins & more'
        },
        {
            title: 'Baby Care',
            image: category2,
            link: '/search?category=baby-care',
            description: 'Baby Food, Diapers & more'
        },
        {
            title: 'Wellness',
            image: category3,
            link: '/search?category=wellness',
            description: 'Health Supplements & more'
        }
    ];

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -240 : 240;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Simplified navigation without auth check
    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault();
        }
        navigate(path);
    };

    return (
        <section className="search-by-category">
            <div className="section-header">
                <div className="header-content">
                    <h4>Shop by Category</h4>
                    <a href="/search" className="view-all-button" onClick={(e) => handleNavigation('/search', e)}>
                        View All categories
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="categories-container">
                {showLeftButton && (
                    <button className="scroll-button scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                )}
                <div className="categories-grid" ref={scrollRef}>
                    {categories.map((category) => (
                        <a 
                            href={category.link} 
                            className="category-item" 
                            key={category.title}
                            onClick={(e) => handleNavigation(category.link, e)}
                        >
                            <div className="category-image-wrapper">
                                <img 
                                    src={category.image} 
                                    alt={category.title} 
                                    className="category-image"
                                />
                            </div>
                            <div className="category-content">
                                <h3>{category.title}</h3>
                                <p>{category.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
                {showRightButton && (
                    <button className="scroll-button scroll-right" onClick={() => scroll('right')} aria-label="Scroll right">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                )}
            </div>
        </section>
    );
}

export default SearchByCategory;
