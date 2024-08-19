import React from 'react';
import './Footer.css'; // Include CSS if needed for styling

function Footer() {
    return (
        <footer className="footer">
            <div className="download-links">
                <a href="#">Download for iOS</a>
                <a href="#">Download for Android</a>
            </div>
            <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                {/* Add more links as needed */}
            </div>
            <p>© 2024 Website. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
