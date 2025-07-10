import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import Logo from '../../ui/Logo';
import { colors } from '../../../styles/colors';
import { useMediaQuery } from 'react-responsive';
import { clearAuthData, getUserId } from '../../../services/User/Auth/auth.utils';
import { userService } from '../../../services/User/Profile/user.service';
import { fetchCartItems, selectCartItemCount, selectCartLoading } from '../../../store/slices/cartSlice';
import { FiSearch, FiMapPin, FiChevronDown, FiMic, FiUser, FiMenu, FiShoppingCart, FiX } from 'react-icons/fi';
import { MdGpsFixed } from 'react-icons/md';

const SearchBox = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const locationDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularLocations = [
    { name: 'Mumbai', address: 'Maharashtra, India' },
    { name: 'Delhi', address: 'National Capital Territory, India' },
    { name: 'Bangalore', address: 'Karnataka, India' },
    { name: 'Hyderabad', address: 'Telangana, India' },
    { name: 'Chennai', address: 'Tamil Nadu, India' }
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    setIsLocationOpen(false);
  };

  const handleUseCurrentLocation = () => {
    // Implement geolocation logic here
    setIsLocationOpen(false);
  };

  return (
    <div className="search-location-container">
      <div className="unified-search-box">
        {/* Location Dropdown */}
        <div className="location-part" ref={locationDropdownRef}>
          <button 
            className="location-button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            aria-expanded={isLocationOpen}
            aria-label="Select location"
          >
            <FiMapPin className="location-icon" aria-hidden="true" />
            <span className="location-text">{selectedLocation}</span>
            <FiChevronDown 
              className="chevron-icon" 
              style={{ transform: isLocationOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              aria-hidden="true"
            />
          </button>

          {isLocationOpen && (
            <div className="location-dropdown">
              <div className="location-search">
                <FiSearch className="search-icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search location..."
                  aria-label="Search location"
                />
              </div>
              <div className="current-location" onClick={handleUseCurrentLocation}>
                <MdGpsFixed className="gps-icon" aria-hidden="true" />
                <span>Use current location</span>
              </div>
              <div className="location-options">
                {popularLocations.map((location, index) => (
                  <div
                    key={index}
                    className="location-option"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="location-details">
                      <span className="location-name">{location.name}</span>
                      <span className="location-address">{location.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="search-part">
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search healthcare services"
          />
          <div className="search-placeholder" aria-hidden="true">
            <span className="static-text">Search for</span>
            <div className="dynamic-text">
              <span>doctors...</span>
              <span>hospitals...</span>
              <span>blood banks...</span>
              <span>pharmacies...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ isAuthenticated, onAuthChange, onShowSignIn }) => {
    const dispatch = useDispatch();
    const cartItemCount = useSelector(selectCartItemCount);
    const location = useLocation();
    
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
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
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

    // Update CSS variables for gradients
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--primary-light', colors.primaryLight);
        document.documentElement.style.setProperty('--primary-dark', colors.primaryDark);
        document.documentElement.style.setProperty('--ai-gradient', colors.aiGradient);
        document.documentElement.style.setProperty('--ai-gradient-hover', colors.aiGradientHover);
        document.documentElement.style.setProperty('--mic-gradient', colors.micGradient);
    }, []);

    const locations = [
        { name: 'Mumbai', address: 'Maharashtra, India', icon: 'city' },
        { name: 'Delhi', address: 'Delhi, India', icon: 'city' },
        { name: 'Bangalore', address: 'Karnataka, India', icon: 'city' },
        { name: 'Hyderabad', address: 'Telangana, India', icon: 'city' },
        { name: 'Chennai', address: 'Tamil Nadu, India', icon: 'city' },
        { name: 'Kolkata', address: 'West Bengal, India', icon: 'city' }
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

    useEffect(() => {
        let lastScrollTop = 0;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Show nav when scrolling up or at top
                    if (currentScrollY < lastScrollY || currentScrollY < 50) {
                        setIsNavVisible(true);
                    } 
                    // Hide nav when scrolling down and not at top
                    else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                        setIsNavVisible(false);
                    }
                    
                    setLastScrollY(currentScrollY);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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

    const handleSpeakClick = () => {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // Initialize speech recognition
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                // Visual feedback that recording has started
                const speakButton = document.querySelector('.speak-button');
                if (speakButton) {
                    speakButton.style.boxShadow = '0 0 0 2px rgba(56, 163, 165, 0.5)';
                }
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                // Set the search query with the speech result
                setSearchQuery(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                // Visual feedback for error
                const speakButton = document.querySelector('.speak-button');
                if (speakButton) {
                    speakButton.style.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.5)';
                    setTimeout(() => {
                        speakButton.style.boxShadow = 'none';
                    }, 2000);
                }
            };

            recognition.onend = () => {
                // Reset visual feedback
                const speakButton = document.querySelector('.speak-button');
                if (speakButton) {
                    speakButton.style.boxShadow = 'none';
                }
            };

            // Start recognition
            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
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
        { path: '/ambulance', text: 'AMBULANCE' },
        { path: '/blood-bank', text: 'BLOOD BANK' },
        { path: '/medicine-order', text: 'MEDICINE DELIVERY' },
        { path: '/hospital-bed-booking', text: 'HOSPITAL BED BOOKING' },
        { path: '/doctor-consultation', text: 'CONSULT DOCTORS' },
        { path: '/lab-tests', text: 'LAB TESTS' },
        { path: '/products', text: 'PRODUCTS' },
        { path: '/child-care', text: 'CHILD CARE' },
        { path: '/ayurveda', text: 'AYURVEDA' },
        { path: '/medical-loans', text: 'MEDICAL LOANS' },
        { path: '/insurance', text: 'MEDICAL INSURANCE' },
    ];

    // Sub Navigation Links
    const subNavLinks = [
        { path: '/physiotherapy', text: 'Physiotherapy' },
        { path: '/care-at-home', text: 'Care At Home' },
        { path: '/medical-tourism', text: 'Medical Tourism' },
        { path: '/rehabilitation', text: 'Rehabilitation' },
        { path: '/early-detection', text: 'Early Detection' },
        { path: '/nutrition', text: 'Nutrition' },
        { path: '/pet-care', text: 'Pet Care' },
        { path: '/organ-donation', text: 'Organ/Hair Donation' },
        { path: '/vaccines', text: 'VACCINES' },
        { path: '/maternal-care', text: 'MATERNAL CARE' },
    ];

    // Render the profile section based on auth status
    const renderProfileSection = () => {
        if (isAuthenticated) {
            return (
                <div className="profile-container">
                    <div className="action-icon" onClick={toggleProfileDropdown}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                    </div>
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
            <div className="action-icon" onClick={handleLoginClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
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
        )},
        { path: '/health-records', text: 'Health Records', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )}
    ];

    return (
        <>
            <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
                {/* Top Bar */}
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
                            <Logo size={isMobile ? 'small' : 'regular'} />
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
                        ) : null}
                    </div>

                    {!isMobile && (
                        <SearchBox />
                    )}
                    <div className="top-actions">
                        <Link to="/membership" className="vedika-plus-btn">
                            <div className="crown-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <span className="plus-text">Vedika<span className="highlight">Plus</span></span>
                        </Link>

                        <button className="speak-button" onClick={handleSpeakClick}>
                            <span className="action-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <defs>
                                        <linearGradient id="speak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8A2BE2" />
                                            <stop offset="33%" stopColor="#4169E1" />
                                            <stop offset="66%" stopColor="#AC4A79" />
                                            <stop offset="100%" stopColor="#8A2BE2" />
                                        </linearGradient>
                                    </defs>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </span>
                            <span>Vedika AI</span>
                        </button>

                        <button className="emergency-button" onClick={handleEmergencyClick}>
                            <span className="action-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

                {/* Main Navigation */}
                <nav className={`main-nav ${isNavVisible ? 'nav-visible' : 'nav-hidden'}`}>
                    <div className="nav-links">
                        {mainNavLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={location.pathname === link.path ? 'active' : ''}
                                onClick={() => handleLinkClick(link.path)}
                            >
                                {link.text}
                            </Link>
                        ))}
                </div>
                </nav>

                {/* Sub Navigation */}
                <div className={`sub-nav ${isNavVisible ? 'nav-visible' : 'nav-hidden'}`}>
                    <div className="sub-nav-links">
                        {subNavLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={location.pathname === link.path ? 'active' : ''}
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
                                <Logo size="small" />
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
                                    <Link 
                                        to="/health-records" 
                                        className="drawer-nav-item" 
                                        onClick={() => handleLinkClick('/health-records')}
                                    >
                                        Health Records
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
                        
                        <div className="modal-section">
                            <strong>English</strong>
                            <p>
                                Thank you for choosing our Emergency Service. For immediate assistance and 24/7 support, please select one of our Premium Membership Plans that includes:
                        </p>
                        <ul>
                                <li>24/7 Priority Emergency Support</li>
                                <li>Instant Lab Test Booking & Report Delivery</li>
                                <li>Direct Access to Healthcare Professionals</li>
                                <li>Unlimited Digital Health Records Storage</li>
                        </ul>
                        </div>

                        <div className="modal-section">
                            <strong>हिंदी</strong>
                            <p>
                                आपातकालीन सेवा चुनने के लिए धन्यवाद। तत्काल सहायता और 24/7 सपोर्ट के लिए, कृपया हमारी प्रीमियम सदस्यता योजनाओं में से एक चुनें जिसमें शामिल हैं:
                        </p>
                        <ul>
                                <li>24/7 प्राथमिकता आपातकालीन सहायता</li>
                                <li>तत्काल लैब टेस्ट बुकिंग और रिपोर्ट डिलीवरी</li>
                                <li>स्वास्थ्य पेशेवरों तक सीधी पहुंच</li>
                                <li>असीमित डिजिटल स्वास्थ्य रिकॉर्ड स्टोरेज</li>
                        </ul>
                        </div>

                        <div className="modal-buttons">
                            <button onClick={proceedToCall}>
                                Connect to Emergency Support
                            </button>
                            <button onClick={() => setShowEmergencyModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;