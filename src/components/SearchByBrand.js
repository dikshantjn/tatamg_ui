import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchByBrand.css';
import brand1 from '../assets/brand_1.png'; // Adjust the paths as necessary
import brand2 from '../assets/brand_2.png';
import brand3 from '../assets/brand_3.png';
import brand4 from '../assets/brand_4.png';
import brand5 from '../assets/brand_5.png';


function SearchByBrand() {
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const navigate = useNavigate();

    const brands = [
        {
            title: 'Wellness Plus',
            image: brand1,
            link: '/search?brand=wellness-plus'
        },
        {
            title: 'MediCare',
            image: brand2,
            link: '/search?brand=medicare'
        },
        {
            title: 'LifeCare',
            image: brand3,
            link: '/search?brand=lifecare'
        },
        {
            title: 'HealthFirst',
            image: brand4,
            link: '/search?brand=healthfirst'
        },
        {
            title: 'VitaCare',
            image: brand5,
            link: '/search?brand=vitacare'
        },
        {
            title: 'MedTech Pro',
            image: brand1,
            link: '/search?brand=medtech-pro'
        },
        {
            title: 'CarePlus',
            image: brand2,
            link: '/search?brand=careplus'
        },
        {
            title: 'PharmaCare',
            image: brand3,
            link: '/search?brand=pharmacare'
        },
        {
            title: 'MedLife',
            image: brand4,
            link: '/search?brand=medlife'
        },
        {
            title: 'HealthHub',
            image: brand5,
            link: '/search?brand=healthhub'
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
        <section className="search-by-brand">
            <div className="section-header">
                <div className="header-content">
                    <h4>Featured Brands</h4>
                    <a href="/search" className="view-all-button" onClick={(e) => handleNavigation('/search', e)}>
                        View All Brands
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </a>
                </div>
            </div>

            <div className="brands-container">
                {showLeftButton && (
                    <button className="scroll-button scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                )}
                <div className="brands-grid" ref={scrollRef}>
                    {brands.map((brand) => (
                        <a 
                            href={brand.link} 
                            className="brand-item" 
                            key={brand.title}
                            onClick={(e) => handleNavigation(brand.link, e)}
                        >
                            <div className="brand-logo-wrapper">
                                <img 
                                    src={brand.image} 
                                    alt={brand.title} 
                                    className="brand-logo"
                                />
                            </div>
                            <h3>{brand.title}</h3>
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

export default SearchByBrand;
