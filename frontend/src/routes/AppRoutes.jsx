import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from '../components/SplashScreen';
import ManagerLogin from '../views/manager/ManagerLogin';
import ManagerHome from '../views/manager/ManagerHome';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/manager/login" element={<ManagerLogin />} />
                <Route path="/manager/home" element={<ManagerHome />} />
                {/* Add more routes for residents, drivers, etc. */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
