import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Access the authentication context. Must be used within an <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
