import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import { colors } from '../styles/colors';
import { useMediaQuery } from 'react-responsive';
import { clearAuthData } from '../services/auth.utils';
import SignIn from '../components/SignIn';

const Header = ({ isAuthenticated, onAuthChange, onLoginClick }) => {
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSigninPanel, setShowSigninPanel] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Select Location');
    const [locationSearch, setLocationSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions] = useState({
        services: [
            { title: 'General Physician', subtitle: 'Consultation', distance: '2.5 km' },
            { title: 'Dental Care', subtitle: 'Dental Services', distance: '3.1 km' },
            { title: 'Physiotherapy', subtitle: 'Physical Therapy', distance: '1.8 km' }
        ],
        hospitals: [
            { title: 'City General Hospital', subtitle: 'Multi-Specialty', distance: '2.0 km' },
            { title: 'Medicare Center', subtitle: 'Primary Care', distance: '3.5 km' }
        ]
    });
    
    const searchRef = useRef(null);
    const locationRef = useRef(null);
    const navigate = useNavigate();

    const locations = [
        { name: 'Current Location', address: 'Using GPS', icon: 'gps' },
        { name: 'Mumbai', address: 'Maharashtra, India', icon: 'city' },
        { name: 'Delhi', address: 'Delhi, India', icon: 'city' },
        { name: 'Bangalore', address: 'Karnataka, India', icon: 'city' },
        { name: 'Hyderabad', address: 'Telangana, India', icon: 'city' }
    ];

    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        let timeoutId;

        const handleScroll = () => {
            // Clear the existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set a new timeout
            timeoutId = setTimeout(() => {
                const header = document.querySelector('.header');
                if (window.scrollY > 50) {
                    if (!header.classList.contains('scrolled')) {
                        header.classList.add('scrolled');
                    }
                } else {
                    if (header.classList.contains('scrolled')) {
                        header.classList.remove('scrolled');
                    }
                }
            }, 10); // Small delay but enough to smooth out the transition
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    useEffect(() => {
        console.log('Header props:', { isAuthenticated, onAuthChange, onLoginClick });
    }, [isAuthenticated, onAuthChange, onLoginClick]);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location.name);
        setShowLocationDropdown(false);
    };

    const handleSearchFocus = () => {
        if (searchQuery.length > 0) {
            setShowSearchSuggestions(true);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSearchSuggestions(e.target.value.length > 0);
    };

    // Handle Emergency Button Click
    const handleEmergencyClick = () => {
        setShowEmergencyModal(true);
    };

    const proceedToCall = () => {
        setShowEmergencyModal(false);
        const confirmCall = window.confirm("Do you want to call emergency services?");
        if (confirmCall) {
            window.location.href = "tel:+919921003190";
        }
    };

    // Handle Logout
    const handleLogout = () => {
        // First close any open menus/drawers
        setShowProfileDropdown(false);
        setShowMobileMenu(false);
        setIsDrawerOpen(false);
        document.body.style.overflow = 'auto';

        // Clear auth data
        const success = clearAuthData();
        if (success) {
            // Update auth state first
            onAuthChange(false);
            // Then navigate
            navigate("/signin", { replace: true });
        }
    };

    // Handle Profile Dropdown
    const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

    // Handle Mobile Menu
    const closeMobileMenu = () => setShowMobileMenu(false);
    const handleMobileNavClick = () => {
        closeMobileMenu();
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        // Prevent body scroll when drawer is open
        document.body.style.overflow = !isDrawerOpen ? 'hidden' : 'auto';
    };

    // Close drawer when route changes
    useEffect(() => {
        return () => {
            setIsDrawerOpen(false);
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Handle Login Click
    const handleLoginClick = () => {
        console.log('Opening signin panel');
        setShowSigninPanel(true);
    };

    // Handle Panel Close
    const handlePanelClose = () => {
        console.log('Closing signin panel');
        setShowSigninPanel(false);
    };

    return (
        <>
            <header className="header">
                {/* Section 1: Top Bar */}
                <div className="top-bar">
                    <div className="logo-section">
                        <div className="mobile-header-left">
                            <button className="mobile-menu-btn" onClick={toggleDrawer}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        </div>

                                            <Link to="/" className="logo-container mobile-logo-container">
                        <img src={logo} alt="Vedika.health" className="logo" />
                        <span className="logo-text mobile-logo-text">Vedika.health</span>
                    </Link>

                    {isMobile ? (
                            <div className="mobile-header-icons">
                                <button className="mobile-header-icon emergency" title="Emergency" onClick={handleEmergencyClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="blink-icon">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </button>
                                <Link to="/checkout" className="mobile-header-icon primary-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <div className="search-container" ref={searchRef}>
                                <div className="search-input-group">
                                    <div className="location-select" onClick={() => setShowLocationDropdown(true)} ref={locationRef}>
                                        <span className="location-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <span className="location-text">{selectedLocation}</span>
                                        <span className="chevron-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="search-section">
                                        <span className="search-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search for services, specialties, doctors, products, brands..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            onFocus={handleSearchFocus}
                                        />
                                    </div>
                                </div>

                                {showLocationDropdown && (
                                    <div className="location-dropdown">
                                        <div className="location-dropdown-header">
                                            <div className="location-search">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="location-icon">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="Search location..."
                                                    value={locationSearch}
                                                    onChange={(e) => setLocationSearch(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="location-list">
                                            {locations.map((location, index) => (
                                                <div
                                                    key={index}
                                                    className={`location-item ${location.icon === 'gps' ? 'current' : ''}`}
                                                    onClick={() => handleLocationSelect(location)}
                                                >
                                                    <span className="location-item-icon">
                                                        {location.icon === 'gps' ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                    <div className="location-item-details">
                                                        <div className="location-item-name">{location.name}</div>
                                                        <div className="location-item-address">{location.address}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showSearchSuggestions && (
                                    <div className="search-suggestions">
                                        <div className="suggestion-group">
                                            <div className="suggestion-group-title">Services</div>
                                            {suggestions.services.map((item, index) => (
                                                <div key={index} className="suggestion-item">
                                                    <span className="suggestion-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </span>
                                                    <div className="suggestion-content">
                                                        <div className="suggestion-title">{item.title}</div>
                                                        <div className="suggestion-subtitle">{item.subtitle}</div>
                                                    </div>
                                                    <div className="suggestion-distance">{item.distance}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="suggestion-group">
                                            <div className="suggestion-group-title">Hospitals</div>
                                            {suggestions.hospitals.map((item, index) => (
                                                <div key={index} className="suggestion-item">
                                                    <span className="suggestion-icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </span>
                                                    <div className="suggestion-content">
                                                        <div className="suggestion-title">{item.title}</div>
                                                        <div className="suggestion-subtitle">{item.subtitle}</div>
                                                    </div>
                                                    <div className="suggestion-distance">{item.distance}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="top-actions">
                        <Link to="/membership" className="action-link vedika-plus">
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <span>Vedika Plus</span>
                        </Link>

                        <button className="speak-button">
                            <span className="action-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </span>
                            <span>Speak with AI</span>
                        </button>

                        <button className="emergency-button" onClick={handleEmergencyClick}>
                            <span className="emergency-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M7.05 7.05l-1.41-1.41m12.71 12.71l-1.41-1.41M7.05 16.95l-1.41 1.41m12.71-12.71l-1.41 1.41M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                        d="M12 9v2m0 2v2m-2-3h2m2 0h2" />
                                </svg>
                            </span>
                            <span>Emergency</span>
                        </button>

                        <Link to="/checkout" className="action-link">
                            <div className="action-icon cart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={colors.textPrimary}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="cart-badge">0</span>
                            </div>
                            <span>Cart</span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="profile-container">
                                <button className="profile-button" onClick={toggleProfileDropdown}>
                                    <span className="action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={colors.textPrimary}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                </button>
                                {showProfileDropdown && (
                                    <div className="profile-dropdown">
                                        <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate('/orders')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            My Orders
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <div className="dropdown-item logout" onClick={handleLogout}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="action-link" onClick={handleLoginClick}>
                                <div className="action-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5l-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                                    </svg>
                                </div>
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>

                {isMobile && (
                    <>
                        <div className="mobile-search-bar">
                            <div className="mobile-search-input">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    className="mobile-search-field"
                                    placeholder="Search for services, specialties, doctors..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                />
                                <button className="mobile-speak-btn" title="Speak with AI">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Section 2: Main Navigation */}
                <div className="main-nav">
                    <nav className="nav-links">
                        <Link to="/products">PRODUCTS</Link>
                        <Link to="/lab-tests">LAB TESTS</Link>
                        <Link to="/doctors">CONSULT DOCTORS</Link>
                        <Link to="/blood-bank">BLOOD BANK</Link>
                        <Link to="/ambulance">AMBULANCE</Link>
                        <Link to="/medical-loans">MEDICAL LOANS</Link>
                        <Link to="/insurance">MEDICAL INSURANCE</Link>
                        <Link to="/vaccines">VACCINES</Link>
                        <Link to="/maternal-care">MATERNAL CARE</Link>
                        <Link to="/child-care">CHILD CARE</Link>
                        <Link to="/delivery">MEDICINE DELIVERY</Link>
                        <Link to="/ayurveda">AYURVEDA</Link>
                    </nav>
                </div>

                {/* Section 3: Sub Navigation */}
                <div className="sub-nav">
                    <div className="sub-nav-links">
                        <Link to="/physiotherapy">Physiotherapy</Link>
                        <Link to="/hosiptal-discovery">Hospital Discovery</Link>
                        <Link to="/care-at-home">Care At Home</Link>
                        <Link to="/medical-tourism">Medical Tourism</Link>
                        <Link to="/rehabilitation">Rehabilitation</Link>
                        <Link to="/early-detection">Early Detection</Link>
                        <Link to="/nutrition">Nutrition</Link>
                        <Link to="/pet-care">Pet Care</Link>
                        <Link to="/organ-donation">Organ/Hair Donation</Link>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                    <div className="mobile-menu-sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <Link to="/" className="mobile-logo" onClick={handleMobileNavClick}>
                                <img src={logo} alt="Vedika.health" className="logo" />
                                <span className="logo-text">Vedika.health</span>
                            </Link>
                            <button className="mobile-menu-close" onClick={closeMobileMenu}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mobile-menu-content">
                            <div className="mobile-search">
                                <div className="mobile-search-input">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="search-icon">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        className="mobile-search-field"
                                        placeholder="Search for services, specialties, doctors..."
                                    />
                                </div>
                            </div>

                            <div className="mobile-actions">
                                <Link to="/membership" className="mobile-action-item" onClick={handleMobileNavClick}>
                                    <div className="mobile-action-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    </div>
                                    Vedika Plus
                                </Link>

                                <button className="mobile-action-item">
                                    <div className="mobile-action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                    Speak with AI
                                </button>

                                <button className="mobile-action-item emergency" onClick={handleEmergencyClick}>
                                    <div className="mobile-action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M12 4.5v-2m0 19v-2M4.5 12h-2m19 0h-2M7.05 7.05l-1.41-1.41m12.71 12.71l-1.41-1.41M7.05 16.95l-1.41 1.41m12.71-12.71l-1.41 1.41M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <circle cx="12" cy="12" r="3" strokeWidth={2} />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M12 9v2m0 2v2m-2-3h2m2 0h2" />
                                        </svg>
                                    </div>
                                    Emergency
                                </button>

                                <Link to="/checkout" className="mobile-action-item" onClick={handleMobileNavClick}>
                                    <div className="mobile-action-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    Cart
                                </Link>

                                {isAuthenticated ? (
                                    <>
                                        <Link to="/profile" className="mobile-action-item" onClick={handleMobileNavClick}>
                                            <div className="mobile-action-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            My Profile
                                        </Link>
                                        <button className="mobile-action-item logout" onClick={handleLogout}>
                                            <div className="mobile-action-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button className="mobile-action-item" onClick={handleLoginClick}>
                                        <div className="mobile-action-icon">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5l-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                                            </svg>
                                        </div>
                                        Login
                                    </button>
                                )}
                            </div>

                            <div className="mobile-nav-section">
                                <h3 className="mobile-nav-title">Main Services</h3>
                                <nav className="mobile-nav-links">
                                    <Link to="/products" onClick={handleMobileNavClick}>PRODUCTS</Link>
                                    <Link to="/lab-tests" onClick={handleMobileNavClick}>LAB TESTS</Link>
                                    <Link to="/doctors" onClick={handleMobileNavClick}>CONSULT DOCTORS</Link>
                                    <Link to="/blood-bank" onClick={handleMobileNavClick}>BLOOD BANK</Link>
                                    <Link to="/ambulance" onClick={handleMobileNavClick}>AMBULANCE</Link>
                                    <Link to="/medical-loans" onClick={handleMobileNavClick}>MEDICAL LOANS</Link>
                                    <Link to="/insurance" onClick={handleMobileNavClick}>MEDICAL INSURANCE</Link>
                                    <Link to="/vaccines" onClick={handleMobileNavClick}>VACCINES</Link>
                                    <Link to="/maternal-care" onClick={handleMobileNavClick}>MATERNAL CARE</Link>
                                    <Link to="/child-care" onClick={handleMobileNavClick}>CHILD CARE</Link>
                                    <Link to="/delivery" onClick={handleMobileNavClick}>MEDICINE DELIVERY</Link>
                                    <Link to="/ayurveda" onClick={handleMobileNavClick}>AYURVEDA</Link>
                                </nav>
                            </div>

                            <div className="mobile-nav-section">
                                <h3 className="mobile-nav-title">Additional Services</h3>
                                <nav className="mobile-nav-links">
                                    <Link to="/physiotherapy" onClick={handleMobileNavClick}>Physiotherapy</Link>
                                    <Link to="/hosiptal-discovery" onClick={handleMobileNavClick}>Hospital Discovery</Link>
                                    <Link to="/care-at-home" onClick={handleMobileNavClick}>Care At Home</Link>
                                    <Link to="/medical-tourism" onClick={handleMobileNavClick}>Medical Tourism</Link>
                                    <Link to="/rehabilitation" onClick={handleMobileNavClick}>Rehabilitation</Link>
                                    <Link to="/early-detection" onClick={handleMobileNavClick}>Early Detection</Link>
                                    <Link to="/nutrition" onClick={handleMobileNavClick}>Nutrition</Link>
                                    <Link to="/pet-care" onClick={handleMobileNavClick}>Pet Care</Link>
                                    <Link to="/organ-donation" onClick={handleMobileNavClick}>Organ/Hair Donation</Link>
                                </nav>
                                {isAuthenticated && (
                                    <button className="drawer-logout-btn" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Emergency Modal */}
            {showEmergencyModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Emergency Service</h2>
                        <p><strong>English:</strong></p>
                        <p>Hello!<br />
                            Thank you for choosing the Emergency Service Option.<br />
                            To avail 24/7 Support, we request you to choose one of the Membership Plans.
                        </p>
                        <ul>
                            <li>24/7 Emergency Support</li>
                            <li>Lab Test Booking and Test Report Delivery</li>
                            <li>Expert Healthcare Professional Assistance</li>
                            <li>Option to add unlimited Healthcare Reports/Prescription/Medical Bills/Mediclaim Policy</li>
                        </ul>

                        <p><strong>Hindi:</strong></p>
                        <p>नमस्ते!<br />
                            आपातकालीन सेवा विकल्प चुनने के लिए धन्यवाद।<br />
                            24/7 सहायता प्राप्त करने के लिए, हम आपसे सदस्यता योजना में से एक चुनने का अनुरोध करते हैं।
                        </p>
                        <ul>
                            <li>24/7 आपातकालीन सहायता</li>
                            <li>लैब टेस्ट बुकिंग और टेस्ट रिपोर्ट डिलीवरी</li>
                            <li>विशेषज्ञ स्वास्थ्य देखभाल पेशेवर सहायता</li>
                            <li>असीमित हेल्थकेयर रिपोर्ट/प्रिस्क्रिप्शन/मेडिकल बिल/मेडिक्लेम पॉलिसी जोड़ने का विकल्प</li>
                        </ul>

                        <div className="modal-buttons">
                            <button onClick={proceedToCall}>Proceed to Call</button>
                            <button onClick={() => setShowEmergencyModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer Menu */}
            <div className={`drawer-menu ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-overlay" onClick={toggleDrawer}></div>
                <div className="drawer-content">
                    <div className="drawer-header">
                        <div className="user-profile">
                            <div className="user-avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="user-info">
                                {isAuthenticated ? (
                                    <>
                                        <h3>Welcome User</h3>
                                        <button className="edit-profile-btn" onClick={() => navigate('/profile')}>View & Edit Profile</button>
                                    </>
                                ) : (
                                    <button onClick={handleLoginClick} className="signin-btn">Sign In</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="drawer-body">
                        <nav className="drawer-nav">
                            <div className="drawer-section">
                                <h3 className="drawer-section-title">Main Services</h3>
                                <Link to="/products" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Products
                                </Link>
                                <Link to="/lab-tests" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Lab Tests
                                </Link>
                                <Link to="/doctors" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Consult Doctors
                                </Link>
                                <Link to="/blood-bank" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Blood Bank
                                </Link>
                                <Link to="/ambulance" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Ambulance
                                </Link>
                                <Link to="/medical-loans" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Medical Loans
                                </Link>
                                <Link to="/insurance" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Medical Insurance
                                </Link>
                            </div>

                            <div className="drawer-section">
                                <h3 className="drawer-section-title">Additional Services</h3>
                                <Link to="/vaccines" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Vaccines
                                </Link>
                                <Link to="/maternal-care" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Maternal Care
                                </Link>
                                <Link to="/child-care" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Child Care
                                </Link>
                                <Link to="/delivery" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                    </svg>
                                    Medicine Delivery
                                </Link>
                                <Link to="/ayurveda" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                    Ayurveda
                                </Link>
                                <Link to="/physiotherapy" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Physiotherapy
                                </Link>
                                <Link to="/hosiptal-discovery" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Hospital Discovery
                                </Link>
                                <Link to="/care-at-home" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Care At Home
                                </Link>
                                <Link to="/medical-tourism" className="drawer-nav-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Medical Tourism
                                </Link>
                                {isAuthenticated && (
                                    <button className="drawer-logout-btn" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Add SignIn component at the end */}
            <SignIn 
                isOpen={showSigninPanel} 
                onClose={handlePanelClose}
                onAuthChange={onAuthChange}
            />
        </>
    );
};

export default Header;
