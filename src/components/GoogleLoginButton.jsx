import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getGoogleLoginUrl } from '../services/apiService';
import '../styles/Auth.css';

/**
 * Starts the server-side Google OAuth2 flow by navigating to the backend
 * authorization endpoint. The backend redirects back to /oauth2/redirect.
 */
const GoogleLoginButton = ({ label = 'Continue with Google' }) => {
  const handleClick = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <button type="button" className="google-button" onClick={handleClick}>
      <FcGoogle className="google-icon" />
      <span>{label}</span>
    </button>
  );
};

export default GoogleLoginButton;
