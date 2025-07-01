import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = ({ isAuthenticated, onAuthChange }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            title: "24/7 Emergency Care",
            subtitle: "Immediate Medical Attention",
            description: "Expert emergency care available round the clock. Your health is our priority.",
            cta: "Call Now",
            link: "/emergency",
            theme: "emergency",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c7-3 9-8.75 9-14H3c0 5.25 2 11 9 14z M12 6V2 M8 6l4-4 4 4"/>
                </svg>
            ),
            accent: "#FF4D4D"
        },
        {
            title: "AI-Powered Health Screening",
            subtitle: "Future of Healthcare",
            description: "Advanced AI diagnostics for early detection of health conditions.",
            cta: "Try Now",
            link: "/ai-screening",
            theme: "ai-health",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            ),
            accent: "#6366F1"
        },
        {
            title: "Premium Health Packages",
            subtitle: "Comprehensive Care",
            description: "Customized health packages for you and your family's complete wellness.",
            cta: "View Packages",
            link: "/packages",
            theme: "premium",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-7L10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
                </svg>
            ),
            accent: "#10B981"
        },
        {
            title: "Mental Wellness Program",
            subtitle: "Mind & Body Balance",
            description: "Expert counseling and therapy sessions for mental well-being.",
            cta: "Book Session",
            link: "/mental-health",
            theme: "mental",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z"/>
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
                </svg>
            ),
            accent: "#8B5CF6"
        },
        {
            title: "Smart Home Care",
            subtitle: "Healthcare at Home",
            description: "Professional medical care in the comfort of your home.",
            cta: "Schedule Visit",
            link: "/home-care",
            theme: "home",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <path d="M9 22V12h6v10"/>
                </svg>
            ),
            accent: "#EC4899"
        },
        {
            title: "Digital Health Records",
            subtitle: "Secure & Accessible",
            description: "Access your medical history anytime, anywhere securely.",
            cta: "Access Records",
            link: "/records",
            theme: "digital",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
            ),
            accent: "#3B82F6"
        },
        {
            title: "Wellness Workshops",
            subtitle: "Learn & Grow",
            description: "Join expert-led sessions on nutrition, fitness, and mental wellness.",
            cta: "Join Workshop",
            link: "/workshops",
            theme: "workshop",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"/>
                </svg>
            ),
            accent: "#F59E0B"
        },
        {
            title: "Family Health Plan",
            subtitle: "Complete Coverage",
            description: "Comprehensive healthcare plans for your entire family.",
            cta: "Get Coverage",
            link: "/family-plan",
            theme: "family",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
            ),
            accent: "#0EA5E9"
        },
        {
            title: "Specialized Treatment",
            subtitle: "Expert Care",
            description: "Advanced medical treatments by specialized healthcare professionals.",
            cta: "Consult Expert",
            link: "/specialized",
            theme: "specialized",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
            ),
            accent: "#14B8A6"
        },
        {
            title: "Preventive Care Program",
            subtitle: "Stay Healthy",
            description: "Regular health check-ups and preventive care consultations.",
            cta: "Start Program",
            link: "/preventive",
            theme: "preventive",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c7-3 9-8.75 9-14H3c0 5.25 2 11 9 14z"/>
                    <path d="M12 22V6M9 2h6"/>
                </svg>
            ),
            accent: "#06B6D4"
        },
        {
            title: "Holistic Healing",
            subtitle: "Natural Wellness",
            description: "Combine modern medicine with traditional healing practices.",
            cta: "Explore Methods",
            link: "/holistic",
            theme: "holistic",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            ),
            accent: "#8B5CF6"
        },
        {
            title: "Telemedicine Services",
            subtitle: "Virtual Care",
            description: "Connect with healthcare providers from anywhere, anytime.",
            cta: "Connect Now",
            link: "/telemedicine",
            theme: "telemedicine",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 10l5 5-5 5"/>
                    <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
                </svg>
            ),
            accent: "#EC4899"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [isPaused, slides.length]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    // Handle navigation with authentication check
    const handleNavigation = (path, e) => {
        if (e) {
            e.preventDefault(); // Prevent default only if event is provided
        }
        if (isAuthenticated) {
            navigate(path, { replace: true });
        } else {
            onAuthChange('showSignin');
        }
    };

    return (
        <section 
            className="hero-banner"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div 
                className="banner-slider"
                style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)` }}
            >
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`banner-slide ${slide.theme}`}
                        style={{
                            '--accent-color': slide.accent,
                            width: `${100 / slides.length}%`
                        }}
                    >
                        <div className="slide-content">
                            <div className="slide-icon" style={{ color: slide.accent }}>
                                {slide.icon}
                            </div>
                            <span className="slide-subtitle">{slide.subtitle}</span>
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-description">{slide.description}</p>
                            <a href={slide.link} className="slide-cta" onClick={(e) => handleNavigation(slide.link, e)}>
                                {slide.cta}
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </a>
                        </div>
                        <div className="slide-background">
                            <div className="geometric-shapes">
                                <div className="shape shape-1"></div>
                                <div className="shape shape-2"></div>
                                <div className="shape shape-3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="banner-navigation">
                <div className="nav-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => handleSlideChange(index)}
                            style={{
                                '--dot-color': slides[index].accent
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBanner; 