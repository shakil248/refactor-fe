import React from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import '../styles/ErrorMessage.css';

/**
 * ErrorMessage Component
 * Displays error messages with a close button.
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message-container">
      <div className="error-content">
        <FiAlertCircle className="error-icon" />
        <div className="error-text">
          <h4>Error</h4>
          <p>{message}</p>
        </div>
        <button className="error-close-btn" onClick={onClose}>
          <FiX />
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
