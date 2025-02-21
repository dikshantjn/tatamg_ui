import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

function SignIn({ setIsAuthenticated }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // If already authenticated, redirect to home
    useEffect(() => {
        if (localStorage.getItem("isAuthenticated") === "true") {
            navigate("/home");
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        // Mock authentication (Replace with actual API call)
        if (email === "Dinesh Jain" && password === "$$8485893924$") {
            localStorage.setItem("user", JSON.stringify({ email }));
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
            navigate("/home"); // Redirect to Home page
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="sign-in-container">
            <div className="sign-in-box">
                <img src="logo-url" alt="Logo" className="logo" />
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email or Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter your email or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <a href="/" className="forgot-password">Forgot Password?</a>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="guest-option">
                    <button className="guest-link" onClick={() => navigate("/home")}>
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
