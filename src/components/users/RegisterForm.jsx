import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser } from "../../api/users.api";
import { Button, TextField, Box, Typography, Link, Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from 'react-i18next';

export const RegisterForm = ({ closeModal, openLoginModal, resetAlert }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!acceptTerms) {
      setPasswordError(t("accept_terms_error"));
      return;
    }

    if (password !== repeatPassword) {
      setPasswordError(t("passwords_do_not_match"));
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
        label={t("first_name_label")}
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
        label={t("last_name_label")}
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
        label={t("username_label")}
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
        label={t("email_label")}
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
        label={t("password_label")}
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
        label={t("repeat_password_label")}
        type="password"
        id="repeatPassword"
        autoComplete="current-password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        {passwordError && <Typography color="error">{passwordError}</Typography>}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              name="acceptTerms"
              color="primary"
            />
          }
          label={
            <Typography>
              <Link component={RouterLink} to="/terms-and-conditions">
                {t('accept_terms_label')}
              </Link>
            </Typography>
          }
        />
      </Box>

      <Box textAlign="center">
        <p>{t('already_have_account')} <Link href="#" onClick={() => { closeModal(); resetAlert(); openLoginModal(); }}>{t('log_in_here')}</Link></p>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">{t("create_button")}</Button>
        <Button type="button" variant="contained" color="error" onClick={() => { closeModal(); resetAlert(); }} sx={{ ml: 2 }}>{t("cancel_button")}</Button>
      </Box>
    </Box>
  );
};