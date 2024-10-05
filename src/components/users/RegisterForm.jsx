import React, { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { registerUser } from "../../api/users.api";
import { Button, TextField, Box, Typography, Link, Checkbox, FormControlLabel, Grid } from "@mui/material";
import { useTranslation } from 'react-i18next';

export const RegisterForm = ({ closeModal, openLoginModal, resetAlert }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!acceptTerms) {
      newErrors.acceptTerms = t('accept_terms_error');
    }

    if (password !== repeatPassword) {
      newErrors.passwordMatch = t('passwords_do_not_match');
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = t('password_invalid');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      if (error.response && error.response.data) {
        const backendErrors = error.response.data.user;
        const apiErrors = {};

        if (backendErrors.email) {
          apiErrors.email = backendErrors.email[0];
        }
        if (backendErrors.username) {
          apiErrors.username = backendErrors.username[0];
        }

        setErrors(apiErrors);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
            error={!!errors.username}
            helperText={errors.username && t('username_exists')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            id="email"
            label={t("email_label")}
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email && t('email_exists')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
            error={!!errors.password}
            helperText={errors.password && t('password_invalid_message')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        {errors.passwordMatch && <Typography color="error">{errors.passwordMatch}</Typography>}
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
        {errors.acceptTerms && <Typography color="error" sx={{ mb: 2 }}>{errors.acceptTerms}</Typography>}
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