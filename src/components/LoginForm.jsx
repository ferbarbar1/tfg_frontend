import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({ closeModal, setToken, openRegisterModal }) => {
  const API_URL = "http://127.0.0.1:8000/api/";
  const [userType, setUserType] = useState("client");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(API_URL + `login/${userType}/`, {
        username,
        password,
      });
      // Guarda el token en el contexto
      setToken(response.data.token);
      closeModal();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={userType} className="input-field" onChange={(e) => setUserType(e.target.value)}>
        <option value="owner">Owner</option>
        <option value="worker">Worker</option>
        <option value="client">Client</option>
      </select>

      <input
        type="text"
        placeholder="Username"
        className="input-field"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input-field"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p>Don&apos;t have an account? <a className="register-link" onClick={() => { closeModal(); openRegisterModal(); }}>Sign up here</a></p>
      <div className="modalFooter">
        <button type="submit" className="button login-button">Login</button>
        <button type="button" className="button close-button" onClick={closeModal}>Close</button>
      </div>
    </form>
  );
};