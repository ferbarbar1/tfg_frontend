import React, { useState, useContext } from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import "../styles/Sidebar.css";
import logo from "../assets/react.svg";
import { NAVLINKS } from "../utils/navLinks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../contexts/AuthContext';

export function Sidebar() {
    const [isHover, setIsHover] = useState(true);
    const { token, setToken, user } = useContext(AuthContext);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <aside className={`sidebar ${isHover ? "active" : ""}`}>
            <div className="open-btn" onClick={() => setIsHover((prev) => !prev)}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="wrapper">
                <div className="top__wrapper">
                    {user && (
                        <div className="header">
                            <span className="header-logo">
                                <img src={logo} alt="" />
                            </span>

                            <div className="header-details">
                                <span className="header-name">{user?.user ? user.user.first_name : user.first_name}</span>
                                <span className="header-email">{user?.user ? user.user.email : user.email}</span>
                            </div>
                        </div>
                    )}
                    <nav className="sidebar-nav">
                        <ul className="nav-menu">
                            {NAVLINKS.map((link) => {
                                // Si el enlace no es público y el usuario no está logueado o el rol del usuario no está en los roles permitidos para este enlace, no lo mostramos
                                if (!link.public && (!user || (link.roles && !link.roles.includes(user.user.role)))) {
                                    return null;
                                }

                                return (
                                    <li key={link.name} className="nav-menu__item">
                                        <a href={link.path} className="nav-menu__link">
                                            <FontAwesomeIcon icon={link.icon} className="material-symbols-outlined" />
                                            <span className="text">{link.name}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {token && (
                    <div className="footer">
                        <a href="/" className="nav-menu__link" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span className="footer-text">Logout</span>
                        </a>
                    </div>
                )}
            </div>
        </aside>
    );
}