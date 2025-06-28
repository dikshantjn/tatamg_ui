import React from 'react';
import './Footer.css';
import { colors } from '../styles/colors';
import iosIcon from '../assets/appstore.png'; // Place your App Store icon in assets
import playstoreIcon from '../assets/playstore.png';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <p className="footer-description">
                        Empowering your health journey with trusted solutions, expert care, and innovative technology.
                    </p>
                    <div className="footer-social">
                        <a href="/" aria-label="Follow us on Facebook" className="footer-social-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 2.1A2.1 2.1 0 0 1 19.1 4.2v15.6A2.1 2.1 0 0 1 17 21.9H7A2.1 2.1 0 0 1 4.9 19.8V4.2A2.1 2.1 0 0 1 7 2.1h10Zm-2.25 4.2h-1.5c-.621 0-1.125.504-1.125 1.125v1.125h2.25l-.375 2.25h-1.875V18h-2.25V10.8H8.25V8.55h1.125V7.425A2.625 2.625 0 0 1 12 4.8h2.25v1.5Z"/>
                            </svg>
                        </a>
                        <a href="/" aria-label="Follow us on Instagram" className="footer-social-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                            </svg>
                        </a>
                        <a href="/" aria-label="Follow us on Twitter" className="footer-social-icon">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 5.92c-.77.34-1.6.57-2.47.67a4.13 4.13 0 0 0 1.81-2.27 8.19 8.19 0 0 1-2.6.99A4.11 4.11 0 0 0 12 8.13c0 .32.04.64.1.94A11.66 11.66 0 0 1 3.1 4.86a4.11 4.11 0 0 0 1.27 5.48c-.7-.02-1.36-.22-1.94-.53v.05c0 2.02 1.44 3.7 3.36 4.08-.35.1-.72.16-1.1.16-.27 0-.52-.03-.77-.07.52 1.62 2.04 2.8 3.84 2.83A8.24 8.24 0 0 1 2 19.13c-.27 0-.54-.02-.8-.05A11.62 11.62 0 0 0 8.29 21.1c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0 0 22 5.92Z"/>
                            </svg>
                        </a>
                        <a href="/" className="app-btn ios" style={{borderColor: colors.primary}} aria-label="Download on App Store">
                            <img src={iosIcon} alt="App Store" className="appstore-icon" />
                        </a>
                        <a href="/" className="app-btn android" style={{borderColor: colors.primary}} aria-label="Get it on Google Play">
                            <img src={playstoreIcon} alt="Play Store" className="playstore-icon" />
                        </a>
                    </div>
                </div>

                <nav className="footer-links" aria-label="Footer Navigation">
                    <div className="footer-column">
                        <h4>Services</h4>
                        <a href="/">Doctor Consultation</a>
                        <a href="/">Lab Tests</a>
                        <a href="/">Medicine Delivery</a>
                        <a href="/">Healthcare Products</a>
                    </div>
                    <div className="footer-column">
                        <h4>Support</h4>
                        <a href="/">Help Center</a>
                        <a href="/">Contact Us</a>
                        <a href="/">FAQs</a>
                        <a href="/">Terms of Service</a>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <a href="/">About Us</a>
                        <a href="/">Careers</a>
                        <a href="/">Blog</a>
                        <a href="/">Press</a>
                    </div>
                    <div className="footer-column">
                        <h4>For Providers</h4>
                        <a href="/">Join as Doctor</a>
                        <a href="/">List Your Hospital</a>
                        <a href="/">Partner With Us</a>
                        <a href="/">Advertise</a>
                    </div>
                </nav>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span>© {currentYear} <strong>Vedika.Health</strong>. All rights reserved.</span>
                    <div className="footer-bottom-links">
                        <a href="/">Privacy Policy</a>
                        <a href="/">Terms & Conditions</a>
                        <a href="/">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
