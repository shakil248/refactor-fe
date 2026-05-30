import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * Lands here after Google login. Reads the tokens the backend appended to the
 * URL, finalizes the session, and forwards to the dashboard.
 */
const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();
  const [error, setError] = useState('');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      setError('Google sign-in failed: missing tokens.');
      return;
    }

    completeOAuthLogin(accessToken, refreshToken)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setError('Google sign-in failed. Please try again.'));
  }, [searchParams, completeOAuthLogin, navigate]);

  if (error) {
    return (
      <div className="auth-container">
        <ErrorMessage message={error} onClose={() => navigate('/login', { replace: true })} />
      </div>
    );
  }

  return <LoadingSpinner message="Completing Google sign-in..." />;
};

export default OAuth2RedirectHandler;
