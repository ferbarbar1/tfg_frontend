import React, { useState, useEffect } from "react";
import { getUserData } from '../api/users.api';

export const AuthContext = React.createContext({
  token: "",
  setToken: () => { },
  user: null,
});

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  const setToken = async (newToken) => {
    localStorage.setItem('token', newToken);

    if (newToken) {
      try {
        const userData = await getUserData(newToken);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setToken(savedToken);
  }, []);

  return (
    <AuthContext.Provider value={{ token: savedToken, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};