import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-logo-section">
                    {/* Logo Section */}
                    <img src="logo-url" alt="Logo" className="footer-logo" />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit Nunc maximus.</p>
                    <div className="footer-social-icons">
                        {/* Social Media Icons */}
                        <a href="/"><i className="fab fa-facebook-f"></i></a>
                        <a href="/"><i className="fab fa-instagram"></i></a>
                        <a href="/"><i className="fab fa-youtube"></i></a>
                        <a href="/"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>
                <div className="footer-links">
                    {/* Links Section */}
                    <div className="footer-column">
                        <h4>Solution</h4>
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
                <div className="footer-download">
                    {/* App Download Links */}
                    {/* <a href="/"><img src="path-to-ios-download.png" alt="Download for iOS" /></a>
                    <a href="/"><img src="path-to-android-download.png" alt="Download for Android" /></a> */}
                    <div className="download-links">
                    <a href="/">Download for iOS</a>
                    <a href="/">Download for Android</a>
                    </div>
                </div>
                <div className="footer-copyright">
                    <p>Copyright © 2024 <strong>Website</strong>. All rights reserved.</p>
                    <a href="/">Terms & Conditions</a> | <a href="/">Privacy Policy</a>
                </div>
            </div>

        </footer>
    );
}

export default Footer;
