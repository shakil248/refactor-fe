import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { requestPasswordReset } from '../services/apiService';
import '../styles/PasswordReset.css';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      // For security do not reveal whether the email exists
      setSuccess('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send password reset. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-container">
      <header className="pr-header">
        <h2>Password Reset</h2>
        <p>Enter the email associated with your account and we'll send a reset link.</p>
      </header>

      <main className="pr-main">
        <ErrorMessage message={error || success} onClose={() => { setError(''); setSuccess(''); }} />
        {loading && <LoadingSpinner message="Sending password reset link..." />}

        {!success && (
          <form className="pr-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div className="pr-actions">
              <button type="submit" className="primary">Send reset link</button>
              <Link to="/" className="link">Back to Home</Link>
            </div>
          </form>
        )}

        {success && (
          <div className="pr-success">
            <p>{success}</p>
            <Link to="/" className="link">Return to home</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default PasswordResetRequest;

