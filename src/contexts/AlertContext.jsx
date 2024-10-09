import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';

const AlertContext = createContext();

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
    const location = useLocation();

    const showAlert = (message, severity = 'success') => {
        setAlert({ open: true, message, severity });
    };

    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        const canceled = queryParams.get('canceled');
        if (success === 'true') {
            showAlert('La cita se ha reservado con éxito.', 'success');
        } else if (canceled === 'true') {
            showAlert('Hubo un error al reservar la cita.', 'error');
        }
    }, [location.search]);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={alert.severity} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};