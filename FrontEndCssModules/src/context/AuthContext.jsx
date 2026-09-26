import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('codehaui_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('codehaui_token');
  });

  const login = async (studentId, password) => {
    const res = await authService.login(studentId, password);
    setUser(res.user);
    setIsAuthenticated(true);
    localStorage.setItem('codehaui_user', JSON.stringify(res.user));
    if (res.token) localStorage.setItem('codehaui_token', res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('codehaui_user');
    localStorage.removeItem('codehaui_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
