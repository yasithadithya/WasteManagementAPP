import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Common Components
import SplashScreen from '../components/SplashScreen';
import {Footer} from '../components/header';
//Manager Components
import ManagerLogin from '../views/manager/ManagerLogin';
import ManagerHome from '../views/manager/ManagerHome';
import ManagerProfile from '../views/manager/ManagerProfile';
//Resident Components
import ResidentLogin from '../views/resident/ResidentLogin';
import ResidentCreate from '../views/resident/ResidentCreate';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/manager" element={<ManagerLogin />} />
        <Route path="/manager/home" element={<ManagerHome />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />

        <Route path="/resident" element={<ResidentLogin />} />
        <Route path="/resident/create" element={<ResidentCreate />} />
      
        {/* Add more routes for residents and drivers */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
