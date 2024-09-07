import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export const ProtectedRoute = ({ roles, children }) => {
    const { user, loading } = useContext(AuthContext);

    // Si la llamada a la API está en progreso o el usuario aún no se ha cargado, muestra un mensaje de carga
    if (loading || !user || !user.user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Si el usuario no tiene rol, redirige a la página /unauthorized
    if (!user.user.role) {
        return <Navigate to="/unauthorized" />;
    }

    // Si el usuario no tiene el rol necesario, redirige a la página /unauthorized
    if (user && roles && !roles.includes(user.user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    // Si el usuario está autenticado y tiene el rol necesario, renderiza el componente
    return children;
};