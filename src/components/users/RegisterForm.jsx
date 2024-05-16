import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../../api/users.api";
import { Button } from "react-bootstrap";

export const RegisterForm = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const userData = {
        user: {
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        subscription_plan: "FREE",
      };

      await registerUser(userData);
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
        type="text"
        placeholder="First Name"
        className="input-field"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input-field"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        className="input-field"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Repeat password"
        className="input-field"
        required
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      {passwordError && <p>{passwordError}</p>}

      <div className="modalFooter">
        <Button type="submit" variant="primary">Register</Button>
        <Button type="button" variant="danger" onClick={closeModal}>Close</Button>
      </div>
    </form>
  );
};