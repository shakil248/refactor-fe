import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Auth.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🔄 Code Refactor
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <span className="navbar-user">
              {user?.firstName} {user?.lastName}
            </span>
            <button type="button" className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link navbar-cta">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
