import React from 'react';
import '../styles/ForbiddenPage.css';

export const ForbiddenPage = () => {
    return (
        <div className="forbidden-page-container">
            <div className="forbidden-content">
                <h1 className="forbidden-title">403 Forbidden</h1>
                <p className="forbidden-message">Sorry, you don't have permission to access this page.</p>
                <button className="back-button" onClick={() => window.location.replace("/")}>Back</button>
            </div>
        </div>
    );
};