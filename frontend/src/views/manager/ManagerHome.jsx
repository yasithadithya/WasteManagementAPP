import React from 'react';

const ManagerHome = () => {
    const manager = JSON.parse(localStorage.getItem('manager'));

    return (
        <div className="manager-home">
            <h1>Hello, {manager.firstName}</h1>
            {/* Add more content for the Manager Home page here */}
        </div>
    );
};

export default ManagerHome;