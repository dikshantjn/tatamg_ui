import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopLayout from './DesktopLayout';  // Main desktop UI
import MobileLayout from './MobileLayout';    // Mobile-specific UI

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Router>
            <Routes>
                {isMobile ? (
                    <Route path="*" element={<MobileLayout />} /> // Show mobile UI
                ) : (
                    <Route path="*" element={<DesktopLayout />} /> // Show desktop UI
                )}
            </Routes>
        </Router>
    );
}

export default App;
