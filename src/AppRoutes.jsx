import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/users/UsersPage";
import { ServicesPage } from "./pages/services/ServicesPage";
import { ServiceFormPage } from "./pages/services/ServiceFormPage";
import { ServiceDetailPage } from "./pages/services/ServiceDetailPage";
import { ClientDetailPage } from "./pages/users/ClientDetailPage";
import { WorkerDetailPage } from "./pages/users/WorkerDetailPage";
import { AppointmentsPage } from "./pages/appointments/AppointmentsPage";
import { AppointmentDetailPage } from "./pages/appointments/AppointmentDetailPage";
import { MyAppointmentsPage } from "./pages/appointments/MyAppointmentsPage";
import { RatingsPage } from "./pages/ratings/RatingsPage";
import { AboutUsPage } from './pages/AboutUsPage';
import { Layout } from './pages/Layout';
import './styles/AppRoutes.css';

const AppRoutes = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={
                        <ProtectedRoute roles={['owner']}>
                            <UsersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/services" element={
                        <ProtectedRoute roles={['owner', 'client']}>
                            <ServicesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/services" element={
                        <ProtectedRoute roles={['client']}>
                            <ServicesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/services/create" element={
                        <ProtectedRoute roles={['owner']}>
                            <ServiceFormPage isUpdate={false} />
                        </ProtectedRoute>
                    } />
                    <Route path="/services/:id/update" element={
                        <ProtectedRoute roles={['owner']}>
                            <ServiceFormPage isUpdate={true} />
                        </ProtectedRoute>
                    } />
                    <Route path="/services/:id/details" element={
                        <ProtectedRoute roles={['client']}>
                            <ServiceDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-appointments" element={
                        <ProtectedRoute roles={['worker', 'client']}>
                            <MyAppointmentsPage />
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
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/unauthorized" element={<ForbiddenPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default AppRoutes;