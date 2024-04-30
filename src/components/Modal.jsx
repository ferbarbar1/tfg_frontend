import React from "react";
import PropTypes from "prop-types";
import "../styles/Modal.css";

export const Modal = ({ isOpen, toggleOpen, children }) => (
  <div className={`overlay ${isOpen ? "open" : ""}`} onClick={toggleOpen}>
    <div className="modal">{children}</div>
  </div>
);

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
