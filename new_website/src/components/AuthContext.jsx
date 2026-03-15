import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.sub, role: decoded.role });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email?.toLowerCase?.();
    if (normalizedEmail?.endsWith("@admin.com")) {
      // Admin users must use the OTP admin login flow.
      return { success: false, admin: true, message: "Use admin login" };
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      setUser({ email: decoded.sub, role });

      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Login failed' };
    }
  };

  const requestAdminOtp = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/admin/request-otp', {
        email,
        password
      });

      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Admin login failed' };
    }
  };

  const verifyAdminOtp = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/admin/verify-otp', {
        email,
        otp
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      setUser({ email: decoded.sub, role });

      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.response?.data || 'OTP verification failed' };
    }
  };

  const register = async (fullName, email, password, dateOfBirth) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        fullName,
        email,
        password,
        dateOfBirth
      });

      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    login,
    requestAdminOtp,
    verifyAdminOtp,
    register,
    logout,
    getToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};