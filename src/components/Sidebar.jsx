import React, { useState, useContext } from "react";
import "../styles/Sidebar.css";
import logo from "../assets/react.svg";
import { NAVLINKS } from "../utils/navLinks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../contexts/AuthContext';

export function Sidebar() {
    const [isHover, setIsHover] = useState(true);
    const { token, setToken } = useContext(AuthContext);
    const { user } = useContext(AuthContext);

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
                    <div className="header">
                        <span className="header-logo">
                            <img src={logo} alt="" />
                        </span>
                        {user && (
                            <div className="header-details">
                                <span className="header-name">{user?.user ? user.user.first_name : user.first_name}</span>
                                <span className="header-email">{user?.user ? user.user.email : user.email}</span>
                            </div>
                        )}
                    </div>
                    <div className="search-box">
                        <FontAwesomeIcon icon={faSearch} />
                        <input type="text" name="searchBox" placeholder="Search..." />
                    </div>
                    <nav className="sidebar-nav">
                        <ul className="nav-menu">
                            {NAVLINKS.map((item) => {
                                return (
                                    <li key={item.name} className="nav-menu__item">
                                        <a href={item.path} className="nav-menu__link">
                                            <FontAwesomeIcon icon={item.icon} className="material-symbols-outlined" />
                                            <span className="text">{item.name}</span>
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