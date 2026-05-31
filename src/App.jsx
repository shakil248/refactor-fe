import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FeedbackPage from './pages/FeedbackPage';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import ConsentBanner from './components/ConsentBanner';

/**
 * Application routes. Authentication state is provided by <AuthProvider> in index.js.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<PasswordResetRequest />} />
        <Route path="/reset-password" element={<PasswordResetConfirm />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ConsentBanner />
    </>
  );
}

export default App;
