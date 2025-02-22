import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Updated from useHistory to useNavigate
import './Header.css';

function Header() {
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // Updated from useHistory to useNavigate

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Updated from history.push to navigate
        }
    };

    return (
        <header className="header">
            {/* Layer 1: Top Bar */}
            <div className="top-bar">
                <div className="location-search">
                    <input 
                        type="text" 
                        placeholder="Location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <div className="buttons">
                    <Link to="/signin">
                        <button>Sign up</button>
                    </Link>
                    <Link to="/signin">
                        <button>Log in</button>
                    </Link>
                    <button className="emergency">Emergency!</button>
                    <button className="speak">Speak</button>
                    <Link to="/checkout">
                        <button>&#x1F6D2; {/* Unicode for shopping cart symbol */}</button>
                    </Link>
                    <button>Offers</button>
                    <button>Membership</button>
                </div>
            </div>

            {/* Layer 2: Main Navigation */}
            <div className="main-nav">
                <div className="logo"> {/* Add your logo here */}</div>
                <nav className="nav-links">
                    <Link to="/products">PRODUCTS</Link>
                    <Link to="/lab-tests">LAB TESTS</Link>
                    <Link to="/">CONSULT DOCTORS</Link>
                    <Link to="/blood-bank">BLOOD BANK</Link>
                    <Link to="/ambulance">AMBULANCE</Link>
                    <Link to="/medical-loans">MEDICAL LOANS</Link>
                    <Link to="/insurance">MEDICAL INSURANCE</Link>
                    <Link to="/vaccines">VACCINES</Link>
                    <Link to="/maternal-care">MATERNAL CARE</Link>
                    <Link to="/delivery">DELIVERY</Link>
                    {/* Add more links as needed */}
                </nav>
            </div>

            {/* Layer 3: Sub Navigation */}
            <div className="sub-nav">
                <a href="/">Physiotherapy</a>
                <a href="/">Hospital Discovery</a>
                <a href="/">Care At Home</a>
                <a href="/">Medical Tourism</a>
                <a href="/">Rehabilitation</a>
                <a href="/">Early Detection</a>
            </div>

            
        </header>
    );
}

export default Header;
