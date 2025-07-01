import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import logo from '../../../assets/logo.png';
import { colors } from '../../../styles/colors';
import { useMediaQuery } from 'react-responsive';
import { clearAuthData, getUserId } from '../../../services/User/Auth/auth.utils';
import { userService } from '../../../services/User/Profile/user.service';
import { fetchCartItems, selectCartItemCount, selectCartLoading } from '../../../store/slices/cartSlice';

const Header = ({ isAuthenticated, onAuthChange, onShowSignIn }) => {
    const dispatch = useDispatch();
    const cartItemCount = useSelector(selectCartItemCount);
    const cartLoading = useSelector(selectCartLoading);
    
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Select Location');
    const [locationSearch, setLocationSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
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

    // Fetch cart items when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, isAuthenticated]);

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
                    setIsScrolled(true);
                } else {
                    if (header.classList.contains('scrolled')) {
                        header.classList.remove('scrolled');
                    }
                    setIsScrolled(false);
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
        console.log('Header props:', { isAuthenticated, onAuthChange });
    }, [isAuthenticated, onAuthChange]);

    // Fetch user profile data when authenticated
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (isAuthenticated) {
                try {
                    const userId = getUserId();
                    if (userId) {
                        const response = await userService.getUserDetails(userId);
                        if (response.data) {
                            const formattedData = userService.formatUserData(response.data);
                            setUserProfile(formattedData);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUserProfile(null);
            }
        };

        fetchUserProfile();
    }, [isAuthenticated]);

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

    // Simplified navigation function - no auth checks
    const handleLinkClick = (path) => {
        // Close all menus first
        closeMobileMenu();
        setShowProfileDropdown(false);
        setIsDrawerOpen(false);
        document.body.style.overflow = 'auto';
        
        // Navigate to the path directly - React Router will handle auth checks
        navigate(path);
    };

    // Handle Login Click
    const handleLoginClick = () => {
        console.log('🔄 Login button clicked');
        console.log('onShowSignIn prop:', onShowSignIn);
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
            document.body.style.overflow = 'auto';
        }
        if (onShowSignIn) {
            console.log('🔄 Calling onShowSignIn');
            onShowSignIn();
        } else {
            console.log('❌ onShowSignIn is not defined');
        }
    };

    // Handle Logout
    const handleLogout = () => {
        console.log('🔄 Logging out user');
        setShowProfileDropdown(false);
        setShowMobileMenu(false);
        setIsDrawerOpen(false);
        document.body.style.overflow = 'auto';

        clearAuthData();
        onAuthChange(false);
        navigate("/");
    };

    // Handle Profile Dropdown
    const toggleProfileDropdown = () => {
        console.log('🔄 Toggling profile dropdown');
        console.log('Current state:', showProfileDropdown);
        setShowProfileDropdown(!showProfileDropdown);
    };

    // Handle Mobile Menu
    const closeMobileMenu = () => {
        setShowMobileMenu(false);
        setIsDrawerOpen(false);
        document.body.style.overflow = 'auto';
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        document.body.style.overflow = !isDrawerOpen ? 'hidden' : 'auto';
    };

    // Main Navigation Links
    const mainNavLinks = [
        { path: '/products', text: 'PRODUCTS' },
        { path: '/lab-tests', text: 'LAB TESTS' },
        { path: '/doctors', text: 'CONSULT DOCTORS' },
        { path: '/blood-bank', text: 'BLOOD BANK' },
        { path: '/ambulance', text: 'AMBULANCE' },
        { path: '/medical-loans', text: 'MEDICAL LOANS' },
        { path: '/insurance', text: 'MEDICAL INSURANCE' },
        { path: '/vaccines', text: 'VACCINES' },
        { path: '/maternal-care', text: 'MATERNAL CARE' },
        { path: '/child-care', text: 'CHILD CARE' },
        { path: '/medicine-order', text: 'MEDICINE DELIVERY' },
        { path: '/ayurveda', text: 'AYURVEDA' }
    ];

    // Sub Navigation Links
    const subNavLinks = [
        { path: '/physiotherapy', text: 'Physiotherapy' },
        { path: '/hospital-discovery', text: 'Hospital Discovery' },
        { path: '/care-at-home', text: 'Care At Home' },
        { path: '/medical-tourism', text: 'Medical Tourism' },
        { path: '/rehabilitation', text: 'Rehabilitation' },
        { path: '/early-detection', text: 'Early Detection' },
        { path: '/nutrition', text: 'Nutrition' },
        { path: '/pet-care', text: 'Pet Care' },
        { path: '/organ-donation', text: 'Organ/Hair Donation' }
    ];

    // Render the profile section based on auth status
    const renderProfileSection = () => {
        if (isAuthenticated) {
            return (
                <div className="profile-container">
                    <button className="profile-button" onClick={toggleProfileDropdown}>
                        <span className="action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                    </button>
                    {showProfileDropdown && (
                        <div className="profile-dropdown">
                            {profileDropdownItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="dropdown-item"
                                    onClick={() => handleLinkClick(item.path)}
                                >
                                    {item.icon}
                                    {item.text}
                                </Link>
                            ))}
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
            );
        }
        return (
            <button className="action-link" onClick={handleLoginClick}>
                <div className="action-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5l-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                    </svg>
                </div>
                <span>Login</span>
            </button>
        );
    };

    // Profile dropdown items
    const profileDropdownItems = [
        { path: '/profile', text: 'My Profile', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )},
        { path: '/order-history', text: 'My Orders', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )},
        { path: '/track-order', text: 'Track Order', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        )}
    ];

    return (
        <>
            <header className="header">
                {/* Section 1: Top Bar */}
                <div className={`top-bar ${isMobile && isScrolled ? 'mobile-scrolled' : ''}`}>
                    <div className="logo-section">
                        <div className={`mobile-header-left ${isMobile && isScrolled ? 'hidden' : ''}`}>
                            {isMobile ? (
                                <div className="mobile-profile-icon" onClick={toggleDrawer}>
                                    {userProfile && userProfile.photo ? (
                                        <img 
                                            src={userProfile.photo} 
                                            alt="Profile" 
                                            className="mobile-profile-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    {userProfile && userProfile.name && !userProfile.photo ? (
                                        <span className="mobile-profile-initial">
                                            {userProfile.name.charAt(0).toUpperCase()}
                                        </span>
                                    ) : null}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        style={{ 
                                            display: (userProfile && (userProfile.photo || userProfile.name)) ? 'none' : 'flex' 
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            ) : (
                                <button className="mobile-menu-btn" onClick={toggleDrawer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <Link to="/" className={`logo-container mobile-logo-container ${isMobile && isScrolled ? 'hidden' : ''}`}>
                            <img src={logo} alt="Vedika.health" className="logo" />
                            <span className="logo-text mobile-logo-text">Vedika.health</span>
                        </Link>

                        {isMobile ? (
                            <div className={`mobile-header-icons ${isScrolled ? 'hidden' : ''}`}>
                                <Link to="/checkout-product-medicine" className="mobile-header-icon primary-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartItemCount > 0 && (
                                        <span className="cart-count">{cartItemCount}</span>
                                    )}
                                </Link>
                                {!isAuthenticated && (
                                    <button className="mobile-signin-btn" onClick={handleLoginClick}>
                                        Sign In
                                    </button>
                                )}
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

                        <Link to="/checkout-product-medicine" className="action-link">
                            <div className="action-icon cart-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={colors.textPrimary}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="cart-badge">{cartItemCount}</span>
                                )}
                            </div>
                            <span>Cart</span>
                        </Link>

                        {renderProfileSection()}
                    </div>
                </div>

                {isMobile && (
                    <>
                        <div className={`mobile-search-bar ${isScrolled ? 'sticky-search' : ''}`}>
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
                <div className={`main-nav ${isMobile && isScrolled ? 'hidden' : ''}`}>
                    <nav className="nav-links">
                        {mainNavLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className="nav-link"
                                onClick={() => handleLinkClick(link.path)}
                            >
                                {link.text}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Section 3: Sub Navigation */}
                <div className={`sub-nav ${isMobile && isScrolled ? 'hidden' : ''}`}>
                    <div className="sub-nav-links">
                        {subNavLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className="nav-link"
                                onClick={() => handleLinkClick(link.path)}
                            >
                                {link.text}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
                    <div className="mobile-menu-sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <Link to="/" className="mobile-logo" onClick={handleLinkClick}>
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
                            <nav className="mobile-nav-links">
                                {mainNavLinks.map((link) => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path} 
                                        className="mobile-nav-link"
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                                {subNavLinks.map((link) => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path} 
                                        className="mobile-nav-link"
                                        onClick={() => handleLinkClick(link.path)}
                                    >
                                        {link.text}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer Menu */}
            <div className={`drawer-menu ${isDrawerOpen ? 'open' : ''}`}>
                <div className="drawer-overlay" onClick={toggleDrawer}></div>
                <div className="drawer-content">
                    <div className="drawer-header">
                        {/* Geometric shapes */}
                        <div className="geometric-shape-1"></div>
                        <div className="geometric-shape-2"></div>
                        
                        <div className="user-profile">
                            <div className="user-avatar">
                                {userProfile && userProfile.photo ? (
                                    <img 
                                        src={userProfile.photo} 
                                        alt="Profile" 
                                        className="user-profile-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    style={{ display: userProfile && userProfile.photo ? 'none' : 'flex' }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="user-info">
                                {isAuthenticated && userProfile ? (
                                    <>
                                        <h3>{userProfile.name || 'Welcome User'}</h3>
                                        <p className="user-phone">{userProfile.phone_number || 'No phone number'}</p>
                                        <Link to="/profile" onClick={closeMobileMenu} className="edit-profile-btn">
                                            View & Edit Profile
                                        </Link>
                                    </>
                                ) : (
                                    <button onClick={handleLoginClick} className="signin-btn">Sign In</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="drawer-body">
                        <nav className="drawer-nav">
                            {mainNavLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path} 
                                    className="drawer-nav-item" 
                                    onClick={() => handleLinkClick(link.path)}
                                >
                                    {link.text}
                                </Link>
                            ))}
                            {subNavLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path} 
                                    className="drawer-nav-item" 
                                    onClick={() => handleLinkClick(link.path)}
                                >
                                    {link.text}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <>
                                    <Link 
                                        to="/profile" 
                                        className="drawer-nav-item" 
                                        onClick={() => handleLinkClick('/profile')}
                                    >
                                        My Profile
                                    </Link>
                                    <Link 
                                        to="/order-history" 
                                        className="drawer-nav-item" 
                                        onClick={() => handleLinkClick('/order-history')}
                                    >
                                        My Orders
                                    </Link>
                                    <Link 
                                        to="/track-order" 
                                        className="drawer-nav-item" 
                                        onClick={() => handleLinkClick('/track-order')}
                                    >
                                        Track Order
                                    </Link>
                                    <button className="drawer-logout-btn" onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

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
        </>
    );
};

export default Header;
