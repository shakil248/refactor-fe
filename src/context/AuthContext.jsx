import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearTokens,
  getAccessToken,
  getCurrentUser,
  login as loginRequest,
  logoutRequest,
  register as registerRequest,
  setTokens,
  getRefreshToken,
} from '../services/apiService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On mount, restore the session if an access token is present.
  useEffect(() => {
    const restoreSession = async () => {
      if (!getAccessToken()) {
        setInitializing(false);
        return;
      }
      try {
        const { data } = await getCurrentUser();
        setUser(data);
      } catch {
        clearTokens();
      } finally {
        setInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginRequest(credentials);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await registerRequest(payload);
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  // Used by the OAuth2 redirect handler once tokens arrive in the URL.
  const completeOAuthLogin = useCallback(async (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    const { data } = await getCurrentUser();
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await logoutRequest(refreshToken);
    } catch {
      // Best-effort: clear local session regardless of server response.
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      initializing,
      login,
      register,
      completeOAuthLogin,
      logout,
    }),
    [user, initializing, login, register, completeOAuthLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
