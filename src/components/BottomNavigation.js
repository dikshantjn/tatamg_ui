import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

function BottomNavigation() {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Create intersection observer to watch the footer
        const observer = new IntersectionObserver(
            (entries) => {
                // When footer becomes visible, hide the navigation
                entries.forEach(entry => {
                    setIsVisible(!entry.isIntersecting);
                });
            },
            {
                threshold: 0.1 // Trigger when 10% of the footer is visible
            }
        );

        // Find the footer element
        const footer = document.querySelector('.footer');
        if (footer) {
            observer.observe(footer);
        }

        // Cleanup observer on component unmount
        return () => {
            if (footer) {
                observer.unobserve(footer);
            }
        };
    }, []);

    return (
        <div className={`bottom-nav-container ${isVisible ? '' : 'hidden'}`}>
            <div className="nav-background"></div>
            <nav className="bottom-nav">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home</span>
                </Link>
                
                <div className="mic-button-container">
                    <button className="nav-item mic-button">
                        <div className="mic-gradient-border">
                            <div className="mic-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            </div>
                        </div>
                        <span>Voice</span>
                    </button>
                </div>
                
                <a href="tel:+911234567890" className="nav-item emergency-call">
                    <div className="phone-blink-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                    </div>
                    <span>Emergency</span>
                </a>
            </nav>
        </div>
    );
}

export default BottomNavigation; 