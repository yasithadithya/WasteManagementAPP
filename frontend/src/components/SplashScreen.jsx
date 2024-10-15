import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/splashScreen.css';  // Import splash screen styles

const SplashScreen = () => {
    const navigate = useNavigate();

    // Function to navigate to the appropriate view based on URL
    const handleClick = () => {
        const currentURL = window.location.href;

        if (currentURL.includes('manager')) {
            navigate('/manager/login');  // Navigate to Manager Login
        } else if (currentURL.includes('resident')) {
            navigate('/resident');  // Navigate to Resident View
        } else if (currentURL.includes('driver')) {
            navigate('/driver');  // Navigate to Driver View
        } else {
            navigate('/');  // Default view if URL doesn't match
        }
    };

    return (
        <div className="splash-screen" onClick={handleClick}>
            <h1>Smart Waste Management System</h1>
            <p>Click to continue...</p>
        </div>
    );
};

export default SplashScreen;
