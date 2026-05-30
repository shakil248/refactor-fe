import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Auth.css';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      return 'Please fill in all fields';
    }
    if (!PASSWORD_RULE.test(form.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start refactoring smarter</p>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-grid">
            <div>
              <label htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" value={form.firstName} onChange={onChange} placeholder="John" />
            </div>
            <div>
              <label htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" value={form.lastName} onChange={onChange} placeholder="Doe" />
            </div>
          </div>

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Repeat password"
          />

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <GoogleLoginButton label="Sign up with Google" />

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
