import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './_HomeButton.css'; // Import a CSS file for styling

const HomeButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  // Hide the button if we are already on the home screen
  if (location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  return (
    <button className="home-button" onClick={goToHome}>
      <FaArrowLeft className="home-icon" /> 
    </button>
  );
};

export default HomeButton;
