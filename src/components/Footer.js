import React from 'react';
import './Footer.css';
import { colors } from '../styles/colors';
import iosIcon from '../assets/appstore.png'; // Place your App Store icon in assets
import playstoreIcon from '../assets/playstore.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <p className="footer-description">
                        Empowering your health journey with trusted solutions, expert care, and innovative technology.
                    </p>
                    <div className="footer-social">
                        <a href="/" aria-label="Facebook" className="footer-social-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M17 2.1A2.1 2.1 0 0 1 19.1 4.2v15.6A2.1 2.1 0 0 1 17 21.9H7A2.1 2.1 0 0 1 4.9 19.8V4.2A2.1 2.1 0 0 1 7 2.1h10Zm-2.25 4.2h-1.5c-.621 0-1.125.504-1.125 1.125v1.125h2.25l-.375 2.25h-1.875V18h-2.25V10.8H8.25V8.55h1.125V7.425A2.625 2.625 0 0 1 12 4.8h2.25v1.5Z" fill="currentColor"/></svg>
                        </a>
                        <a href="/" aria-label="Instagram" className="footer-social-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                        </a>
                        <a href="/" aria-label="YouTube" className="footer-social-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4" fill="currentColor" opacity=".1"/><path d="M10 9.5v5l4-2.5-4-2.5Z" fill="currentColor"/></svg>
                        </a>
                        <a href="/" aria-label="Twitter" className="footer-social-icon">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 5.92c-.77.34-1.6.57-2.47.67a4.13 4.13 0 0 0 1.81-2.27 8.19 8.19 0 0 1-2.6.99A4.11 4.11 0 0 0 12 8.13c0 .32.04.64.1.94A11.66 11.66 0 0 1 3.1 4.86a4.11 4.11 0 0 0 1.27 5.48c-.7-.02-1.36-.22-1.94-.53v.05c0 2.02 1.44 3.7 3.36 4.08-.35.1-.72.16-1.1.16-.27 0-.52-.03-.77-.07.52 1.62 2.04 2.8 3.84 2.83A8.24 8.24 0 0 1 2 19.13c-.27 0-.54-.02-.8-.05A11.62 11.62 0 0 0 8.29 21.1c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.18 8.18 0 0 0 22 5.92Z" fill="currentColor"/></svg>
                        </a>
                        <a href="/" className="app-btn ios" style={{borderColor: colors.primary}}>
                            <img src={iosIcon} alt="App Store" className="appstore-icon large" />
                        </a>
                        <a href="/" className="app-btn android" style={{borderColor: colors.primary}}>
                            <img src={playstoreIcon} alt="Play Store" className="playstore-icon large" />
                        </a>
                    </div>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Solutions</h4>
                        <a href="/">Marketing</a>
                        <a href="/">Analytics</a>
                        <a href="/">Commerce</a>
                        <a href="/">Insights</a>
                    </div>
                    <div className="footer-column">
                        <h4>Support</h4>
                        <a href="/">Pricing</a>
                        <a href="/">Documentation</a>
                        <a href="/">Guides</a>
                        <a href="/">Vendor Sign Up</a>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <a href="/">About</a>
                        <a href="/">Experts</a>
                        <a href="/">Blog</a>
                        <a href="/">Jobs</a>
                        <a href="/">Press</a>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <a href="/">Claim</a>
                        <a href="/">Privacy</a>
                        <a href="/">Terms</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span>© 2024 <strong>Website</strong>. All rights reserved.</span>
                    <span className="footer-bottom-links">
                        <a href="/">Terms & Conditions</a>
                        <span> | </span>
                        <a href="/">Privacy Policy</a>
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
