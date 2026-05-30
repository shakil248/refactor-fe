import React from 'react';
import '../styles/LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Displays a loading indicator during refactoring process.
 */
const LoadingSpinner = ({ message = 'Refactoring code...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
