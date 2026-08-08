import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || null);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('admin_token', token);
    } else {
      sessionStorage.removeItem('admin_token');
    }
  }, [token]);

  const verifyPassword = async (password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/verify`, { password });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || 'Invalid password' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const logoutAdmin = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdminAuthorized: !!token, verifyPassword, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
