import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../../api/users.api";
import { Button, TextField, Box, Typography } from "@mui/material";

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
      };

      await registerUser(userData);
      closeModal();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        autoFocus
        id="firstName"
        label="First Name"
        name="firstName"
        autoComplete="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="repeatPassword"
        label="Repeat Password"
        type="password"
        id="repeatPassword"
        autoComplete="current-password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      {passwordError && <Typography color="error">{passwordError}</Typography>}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">Register</Button>
        <Button type="button" variant="contained" color="secondary" onClick={closeModal} sx={{ ml: 2 }}>Close</Button>
      </Box>
    </Box>
  );
};