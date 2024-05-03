import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal";
import { LoginForm } from "../components/users/LoginForm";
import { RegisterForm } from "../components/users/RegisterForm";
import "../styles/Modal.css";
import '../styles/Buttons.css';
import '../styles/Inputs.css';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

Modal.setAppElement("#root");

export function HomePage() {
  const { token, setToken } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Comprueba si el usuario ya ha iniciado sesión al cargar la página
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Guarda el token en el localStorage cuando cambia
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <>
      <h1 className="page-title">Welcome to FisioterAppIA Clinic!</h1>
      {!token && (
        <p style={{ textAlign: 'center' }}>
          Your journey to a pain-free life starts here. Access quality physiotherapy from the comfort of your home with our intuitive platform and expert physiotherapists. Get started today!
        </p>
      )}
      <img src={logo} alt="Application logo" className="app-logo" />


      {!token && (
        <div className="button-container">
          <button className="button register-button" onClick={() => setRegisterModalOpen(true)}>Register</button>
          <Modal
            isOpen={registerModalOpen}
            onRequestClose={() => setRegisterModalOpen(false)}
            className="modalContent"
          >
            <div className="modalHeader">
              <h2>Register</h2>
            </div>
            <div className="modalBody">
              <RegisterForm closeModal={() => setRegisterModalOpen(false)} setToken={setToken} />
            </div>
          </Modal>

          <button className="button login-button" onClick={() => setLoginModalOpen(true)}>Login</button>
          <Modal
            isOpen={loginModalOpen}
            onRequestClose={() => setLoginModalOpen(false)}
            className="modalContent"
          >
            <div className="modalHeader">
              <h2>Login</h2>
            </div>
            <div className="modalBody">
              <LoginForm closeModal={() => setLoginModalOpen(false)} setToken={setToken} openRegisterModal={() => setRegisterModalOpen(true)} />
            </div>
          </Modal>
        </div>
      )}

    </>
  );
}