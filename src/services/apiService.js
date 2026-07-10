import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://refactor-6x4d.onrender.com'

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// ============= Token storage =============

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ============= Axios client =============

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
});

// A bare client used for token refresh so we don't trigger the interceptor loop.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original && AUTH_PATHS.some((p) => original.url?.includes(p));

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }
      try {
        const { data } = await refreshClient.post('/api/auth/refresh', { refreshToken });
        setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ============= Auth API =============

export const register = (payload) => apiClient.post('/api/auth/register', payload);

export const login = (payload) => apiClient.post('/api/auth/login', payload);

export const logoutRequest = (refreshToken) =>
  apiClient.post('/api/auth/logout', { refreshToken });

export const getCurrentUser = () => apiClient.get('/api/user/me');

export const requestPasswordReset = (email) =>
  apiClient.post('/api/auth/forgot-password', { email });

export const confirmPasswordReset = (token, newPassword) =>
  apiClient.post('/api/auth/reset-password', { token, newPassword });

export const getGoogleLoginUrl = () => `${API_BASE_URL}/oauth2/authorization/google`;

// ============= Refactor API (existing feature) =============

export const refactorCode = (code) => {
  // Strip all spaces and newline characters before sending to the endpoint.
  const strippedCode = (code || '').replace(/[ \n\r]/g, '');
  return apiClient.post('/api/refactor', { code: strippedCode });
};

// ============= Feedback API =============

export const submitFeedback = ({ email, message }) =>
  apiClient.post('/api/feedback', { email: email || undefined, message });

export default apiClient;
