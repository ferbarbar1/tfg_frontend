import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/users/UsersPage";
import { ServicesPage } from "./pages/services/ServicesPage";
import { ServiceDetailPage } from "./pages/services/ServiceDetailPage";
import { ClientDetailPage } from "./pages/users/ClientDetailPage";
import { WorkerDetailPage } from "./pages/users/WorkerDetailPage";
import { AppointmentsPage } from "./pages/appointments/AppointmentsPage";
import { AppointmentDetailPage } from "./pages/appointments/AppointmentDetailPage";
import { Sidebar } from "./components/Sidebar";
import { RatingsPage } from "./pages/ratings/RatingsPage";
import { AuthContext } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import './styles/AppRoutes.css';

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null; // o renderiza un componente de carga, o redirige al usuario a una página de inicio de sesión
    }

    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/users" element={
                            <ProtectedRoute roles={['owner']}>
                                <UsersPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/services" element={
                            <ProtectedRoute roles={['owner']}>
                                <ServicesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/services/create" element={
                            <ProtectedRoute roles={['owner']}>
                                <ServiceDetailPage isUpdate={false} />
                            </ProtectedRoute>
                        } />
                        <Route path="/services/:id/update" element={
                            <ProtectedRoute roles={['owner']}>
                                <ServiceDetailPage isUpdate={true} />
                            </ProtectedRoute>
                        } />
                        <Route path="/clients/create" element={
                            <ProtectedRoute roles={['owner']}>
                                <ClientDetailPage isUpdate={false} />
                            </ProtectedRoute>
                        } />
                        <Route path="/clients/:id/update" element={
                            <ProtectedRoute roles={['owner']}>
                                <ClientDetailPage isUpdate={true} />
                            </ProtectedRoute>
                        } />
                        <Route path="/workers/create" element={
                            <ProtectedRoute roles={['owner']}>
                                <WorkerDetailPage isUpdate={false} />
                            </ProtectedRoute>
                        } />
                        <Route path="/workers/:id/update" element={
                            <ProtectedRoute roles={['owner']}>
                                <WorkerDetailPage isUpdate={true} />
                            </ProtectedRoute>
                        } />
                        <Route path="/appointments" element={
                            <ProtectedRoute roles={['owner']}>
                                <AppointmentsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/appointments/:id" element={
                            <ProtectedRoute roles={['owner']}>
                                <AppointmentDetailPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute roles={['owner']}>
                                <RatingsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/unauthorized" element={<ForbiddenPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;