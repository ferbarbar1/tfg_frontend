import React, { useState, useContext } from "react";
import { LoginForm } from "../components/users/LoginForm";
import { RegisterForm } from "../components/users/RegisterForm";
import { Typography, Button, Box, Modal, Grid, Paper } from "@mui/material";
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { PersonAdd, Login } from '@mui/icons-material';

export function HomePage() {
  const { t } = useTranslation();
  const { token, setToken } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <Box sx={{ position: 'relative', textAlign: 'center', mb: 2, p: '0 10px' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
          {t('welcome_message')}
        </Typography>
        <Typography variant="h6" component="h2" sx={{ color: 'text.secondary', mt: 2 }}>
          {t('intro_message')}
        </Typography>
        <Box
          component="img"
          src={logo}
          alt={t('logo_alt')}
          sx={{
            width: '100%', maxWidth: '330px', display: 'block', mx: 'auto'
          }}
        />
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: '100%', height: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {t('innovative_technology')}
            </Typography>
            <Typography variant="body1">
              {t('innovative_technology_description')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: '100%', height: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {t('personalized_services')}
            </Typography>
            <Typography variant="body1">
              {t('personalized_services_description')}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', width: '100%', maxWidth: '100%', height: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {t('remote_physiotherapy')}
            </Typography>
            <Typography variant="body1">
              {t('remote_physiotherapy_description')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {!token && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAdd />}
            onClick={() => setRegisterModalOpen(true)}
            sx={{ bgcolor: 'secondary.main', mb: 2 }}
          >
            {t('sign_up')}
          </Button>
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

          <Button
            variant="contained"
            color="primary"
            startIcon={<Login />}
            onClick={() => setLoginModalOpen(true)}
            sx={{ mb: 2 }}
          >
            {t('login')}
          </Button>
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
