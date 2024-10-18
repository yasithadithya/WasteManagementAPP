import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Common Components
import SplashScreen from '../components/SplashScreen';

//Manager Components
import ManagerLogin from '../views/manager/ManagerLogin';
import ManagerHome from '../views/manager/ManagerHome';
import ManagerProfile from '../views/manager/ManagerProfile';
import ManagerJob from '../views/manager/ManagerJob';
//Resident Components
import ResidentLogin from '../views/resident/ResidentLogin';
import ResidentCreate from '../views/resident/ResidentCreate';
import ResidentHome from '../views/resident/ResidentHome';
import ResidentProfile from '../views/resident/ResidentProfile';
import ResidentJobCreate from '../views/resident/ResidentJobCreate';
//Emp Components
import EmpLogin from '../views/employee/empLogin';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/manager" element={<ManagerLogin />} />
        <Route path="/manager/home" element={<ManagerHome />} />
        <Route path="/manager/profile" element={<ManagerProfile />} />
        <Route path="/manager/job" element={<ManagerJob />} />

        <Route path="/resident" element={<ResidentLogin />} />
        <Route path="/resident/create" element={<ResidentCreate />} />
        <Route path="/resident/home" element={<ResidentHome />} />
        <Route path="/resident/profile" element={<ResidentProfile />} />
        <Route path="/resident/job" element={<ResidentJobCreate />} />

        <Route path="/employee" element={<EmpLogin />} />
      
        {/* Add more routes for residents and drivers */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
