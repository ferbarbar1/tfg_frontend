import React, { useState, useContext } from "react";
import { LoginForm } from "../components/users/LoginForm";
import { RegisterForm } from "../components/users/RegisterForm";
import { Typography, Button, Box, Divider, Modal } from "@mui/material";
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();
  const { token, setToken } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        {t('welcome_message')}
      </Typography>
      <Divider sx={{ marginBottom: 4, bgcolor: 'grey' }} />
      <Typography variant="body1" align="center" paragraph>
        {t('intro_message')}
      </Typography>
      <Box component="img" src={logo} alt={t('logo_alt')} sx={{ width: '100%', maxWidth: '330px', display: 'block', mx: 'auto' }} />

      {!token && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => setRegisterModalOpen(true)}>{t('sign_up')}</Button>
          <Modal
            open={registerModalOpen}
            onClose={() => setRegisterModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ width: '100%', maxWidth: '400px', p: 2, bgcolor: 'background.paper', margin: 'auto', mt: 2 }}>
              <RegisterForm closeModal={() => setRegisterModalOpen(false)} setToken={setToken} />
            </Box>
          </Modal>

          <Button variant="contained" color="primary" onClick={() => setLoginModalOpen(true)}>{t('login')}</Button>
          <Modal
            open={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ width: '100%', maxWidth: '400px', p: 2, bgcolor: 'background.paper', margin: 'auto', mt: 2 }}>
              <LoginForm closeModal={() => setLoginModalOpen(false)} setToken={setToken} openRegisterModal={() => setRegisterModalOpen(true)} />
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
}