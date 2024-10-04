import React, { useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = React.createContext({
  token: "",
  setToken: () => { },
  user: null,
});

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem('token');
  const [token, setToken] = useState(savedToken);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        const response = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setUser(response.data);
      }
    };

    getUserData();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};