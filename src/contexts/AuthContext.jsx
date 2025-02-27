import React, { createContext, useContext, useState } from 'react';
import axios from 'axios'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  const login = (token,userData, businessData, ads) => {
    setUser(userData);
    setBusiness(businessData);
    axios.defaults.headers.common["Authorization"] = JSON.stringify(
        `Bearer ${token}`
    );
    localStorage.setItem('token', token); // Salva o token no localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Salva os dados do usuário
    localStorage.setItem('business', JSON.stringify(businessData)); // Salva os dados do negócio
    localStorage.setItem('ads', JSON.stringify(ads)); // Salva os dados dos anúncios
  };

  const logout = () => {
    setUser(null);
    setBusiness(null);
  };

  return (
    <AuthContext.Provider value={{ user, business, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);