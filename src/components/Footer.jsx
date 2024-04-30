import React from 'react';
import '../styles/Footer.css';

export function Footer() {

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-body">
                    <nav className="footer-body__nav">
                        <ul className="footer-body__nav-list">
                            <li className="footer-body__nav-item">
                                Services
                                <ul className="footer-body__nav-sublist">
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Marketing</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Design</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">App Development</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Web development</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="footer-body__nav-item">
                                About
                                <ul className="footer-body__nav-sublist">
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">About</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Careers</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">History</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Our Team</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="footer-body__nav-item">
                                Support
                                <ul className="footer-body__nav-sublist">
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">FAQs</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Contact</a>
                                    </li>
                                    <li className="footer-body__nav-subitem">
                                        <a href="#" className="footer-body__nav-link">Live chat</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="footer-attribute">
                    <p>&copy; Company 2024. All right reserved.</p>
                </div>
            </div>
        </footer>
    );
}