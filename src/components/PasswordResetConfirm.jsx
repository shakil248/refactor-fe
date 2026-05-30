import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { confirmPasswordReset } from '../services/apiService';
import '../styles/PasswordReset.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordResetConfirm = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('No password reset token provided.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Missing token');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword);
      setSuccess(true);
      // optionally navigate to login after a short delay
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. The token may be invalid or expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <header className="pr-header">
        <h2>Set a New Password</h2>
        <p>Choose a strong password for your account.</p>
      </header>

      <main className="pr-main">
        <ErrorMessage message={error} onClose={() => setError('')} />
        {loading && <LoadingSpinner message="Updating password..." />}

        {!success ? (
          <form className="pr-form" onSubmit={handleSubmit}>
            <label htmlFor="newPassword">New password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />

            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
            />

            <div className="pr-actions">
              <button type="submit" className="primary">Set password</button>
              <Link to="/" className="link">Cancel</Link>
            </div>
          </form>
        ) : (
          <div className="pr-success">
            <p>Your password has been reset successfully. Redirecting to home...</p>
            <Link to="/" className="link">Go to home now</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default PasswordResetConfirm;

