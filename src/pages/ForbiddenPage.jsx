import React from 'react';
import '../styles/ForbiddenPage.css';
import { Button } from 'react-bootstrap';

export const ForbiddenPage = () => {
    return (
        <div className="forbidden-page-container">
            <div className="forbidden-content">
                <h1 className="forbidden-title">403 Forbidden</h1>
                <p className="forbidden-message">Sorry, you don&apos;t have permission to access this page.</p>
                <Button variant="secondary" onClick={() => window.location.replace("/")}>Back</Button>
            </div>
        </div>
    );
};