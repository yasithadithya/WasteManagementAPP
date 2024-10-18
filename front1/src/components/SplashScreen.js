import React from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    switch (role) {
      case 'manager':
        navigate('/manager');
        break;
      case 'resident':
        navigate('/resident');
        break;
      case 'driver':
        navigate('/employee');
        break;
      default:
        break;
    }
  };

  return (
    <div className="splash-screen">
      <h1>Welcome to Waste Management System</h1>
      <div className="buttons">
        <button onClick={() => handleNavigation('manager')}>Manager</button>
        <button onClick={() => handleNavigation('resident')}>Resident</button>
        <button onClick={() => handleNavigation('driver')}>Driver</button>
      </div>
    </div>
  );
};

export default SplashScreen;
