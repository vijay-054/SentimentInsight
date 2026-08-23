import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios to send the token with every request if it exists
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const activeSession = localStorage.getItem('activeUser');
    const token = localStorage.getItem('token');
    if (activeSession && token) {
      setCurrentUser(JSON.parse(activeSession));
    }
    setLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      const { user, token } = response.data;
      setCurrentUser(user);
      localStorage.setItem('activeUser', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, token } = response.data;
      setCurrentUser(user);
      localStorage.setItem('activeUser', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Invalid email or password');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('activeUser');
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    token: localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
