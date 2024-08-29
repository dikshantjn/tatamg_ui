// SignIn.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    return (
        <div className="sign-in-container">
            <div className="sign-in-box">
                <img src="logo-url" alt="Logo" className="logo" />
                <h2>Login</h2>
                <form>
                    <div className="input-group">
                        <label>Email or Phone Number</label>
                        <input type="text" placeholder="Enter your email or phone number" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <a href="/" className="forgot-password">Forgot Password?</a>
                        <input type="password" placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="separator">
                    <span>What new?</span>
                </div>
                <button className="sign-up-button">Sign Up</button>
                <div className="guest-option">
                    <Link to="/" className="guest-link">Continue as Guest</Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
