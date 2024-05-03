import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ roles, children }) => {
    const { user } = useContext(AuthContext);

    // Si el usuario no está autenticado, redirige a la página de inicio de sesión
    if (!user) {
        return <Navigate to="/" />;
    }

    // Si el usuario no tiene el rol necesario, redirige a la página /unauthorized
    if (user && roles && !roles.includes(user.user.role)) {

        return <Navigate to="/unauthorized" />;
    }

    // Si el usuario está autenticado y tiene el rol necesario, renderiza el componente
    return children;
};