import React, { useState } from "react";
import { loginUser, getUserByUsername } from '../../api/users.api';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Link, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';

export const LoginForm = ({ closeModal, setToken, openRegisterModal, resetAlert }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
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
    } catch (error) {
      console.error(error);
      setErrors({ form: t('invalid_credentials') });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>

      {errors.form && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {errors.form}
        </Typography>
      )}

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="username"
        label={t('username_label')}
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label={t('password_label')}
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box textAlign="center">
        <p>{t('dont_have_account')} <Link href="#" onClick={() => { closeModal(); resetAlert(); openRegisterModal(); }}>{t('sign_up_here')}</Link></p>
        <p>{t('forgot_password')} <Link href="#" onClick={() => { closeModal(); resetAlert(); navigate('/password-reset'); }}>{t('reset_it_here')}</Link></p>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">{t('login_button')}</Button>
        <Button type="button" variant="contained" color="error" onClick={() => { closeModal(); resetAlert(); }} sx={{ ml: 2 }}>{t('cancel_button')}</Button>
      </Box>
    </Box>
  );
};