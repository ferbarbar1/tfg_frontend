import React, { useState, useEffect, useCallback } from "react";
import { getUserData } from '../api/users.api';

export const AuthContext = React.createContext({
  token: "",
  setToken: () => { },
  user: null,
});

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token');
  const [token, setTokenState] = useState(savedToken || "");
  const [user, setUser] = useState(null);

  const setToken = useCallback(async (newToken) => {
    localStorage.setItem('token', newToken);
    setTokenState(newToken);

    if (newToken && newToken.trim() !== '') {
      try {
        const userData = await getUserData(newToken);
        setUser(userData);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          // El token es inválido, borra el token del almacenamiento local
          localStorage.removeItem('token');
          setTokenState("");
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (savedToken) {
      setToken(savedToken);
    }
  }, [savedToken, setToken]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};