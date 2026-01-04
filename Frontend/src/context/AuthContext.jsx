import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth on page reload
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Signup failed'
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot', { email });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Request failed'
      };
    }
  };

  const resetPassword = async (token, id, password) => {
    try {
      await api.post('/auth/reset', { token, id, password });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Reset failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
