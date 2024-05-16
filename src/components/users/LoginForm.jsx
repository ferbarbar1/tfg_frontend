import React, { useState } from "react";
import { loginUser, getUserByUsername } from '../../api/users.api';
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";

export const LoginForm = ({ closeModal, setToken, openRegisterModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userResponse = await getUserByUsername(username);

      // Si no se encontró ningún usuario, lanza un error
      if (userResponse.data.length === 0) {
        throw new Error('User not found');
      }

      // Toma el primer usuario de la lista
      const user = userResponse.data[0];
      const userType = user.role;

      const token = await loginUser(username, password, userType);

      // Guarda el token en el contexto
      setToken(token);
      closeModal();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <Button type="submit" variant="primary">Login</Button>
        <Button type="button" variant="danger" onClick={closeModal}>Close</Button>
      </div>
    </form>
  );
};