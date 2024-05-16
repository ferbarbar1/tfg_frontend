import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { LoginForm } from "../components/users/LoginForm";
import { RegisterForm } from "../components/users/RegisterForm";
import { Button } from "react-bootstrap";
import "../styles/Modal.css";
import '../styles/Inputs.css';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

Modal.setAppElement("#root");

export function HomePage() {
  const { token, setToken } = useContext(AuthContext);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

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
          <Button variant="primary" onClick={() => setRegisterModalOpen(true)}>Register</Button>
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

          <Button variant="primary" onClick={() => setLoginModalOpen(true)}>Login</Button>
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