import React, { useState, useContext } from "react";
import { LoginForm } from "../components/users/LoginForm";
import { RegisterForm } from "../components/users/RegisterForm";
import { Typography, Button, Box, Divider, Modal } from "@mui/material";
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export function HomePage() {
  const { token, setToken } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Welcome to FisioterAppIA Clinic!
      </Typography>
      <Divider sx={{ marginBottom: 4, bgcolor: 'grey' }} />
      <Typography variant="body1" align="center" paragraph>
        Your journey to a pain-free life starts here. Access quality physiotherapy from the comfort of your home with our intuitive platform and expert physiotherapists. Get started today!
      </Typography>
      <Box component="img" src={logo} alt="Application logo" sx={{ width: '100%', maxWidth: '330px', display: 'block', mx: 'auto' }} />

      {!token && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', mt: 3 }}>
          <Button variant="contained" color="primary" onClick={() => setRegisterModalOpen(true)}>Sign Up</Button>
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

          <Button variant="contained" color="primary" onClick={() => setLoginModalOpen(true)}>Login</Button>
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