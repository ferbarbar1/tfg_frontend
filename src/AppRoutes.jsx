import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { InformTemplate } from './components/informs/InformTemplate';
import { OfferForm } from './components/offers/OfferForm';
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AboutUsPage } from './pages/AboutUsPage';
import { AppointmentDetailPage } from "./pages/appointments/AppointmentDetailPage";
import { AppointmentsPage } from "./pages/appointments/AppointmentsPage";
import { MyAppointmentsDetailPage } from "./pages/appointments/MyAppointmentsDetailPage";
import { MyAppointmentsPage } from "./pages/appointments/MyAppointmentsPage";
import { ErrorPage } from './pages/ErrorPage';
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { HomePage } from "./pages/HomePage";
import { Layout } from './pages/Layout';
import { OffersPage } from './pages/offers/OffersPage';
import { RatingsPage } from "./pages/ratings/RatingsPage";
import { ServiceDetailPage } from "./pages/services/ServiceDetailPage";
import { ServiceFormPage } from "./pages/services/ServiceFormPage";
import { ServicesPage } from "./pages/services/ServicesPage";
import { ClientDetailPage } from "./pages/users/ClientDetailPage";
import { ProfilePage } from "./pages/users/ProfilePage";
import { UsersPage } from "./pages/users/UsersPage";
import { WorkerDetailPage } from "./pages/users/WorkerDetailPage";
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
                    <Route path="/my-appointments/:id/details" element={
                        <ProtectedRoute roles={['worker', 'client']}>
                            <MyAppointmentsDetailPage />
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
                    <Route path="/appointments/:id/details" element={
                        <ProtectedRoute roles={['owner']}>
                            <AppointmentDetailPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/appointments/:id/inform" element={
                        <ProtectedRoute roles={['owner', 'worker', 'client']}>
                            <InformTemplate />
                        </ProtectedRoute>
                    } />
                    <Route path="/offers" element={
                        <ProtectedRoute roles={['owner']}>
                            <OffersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/offers/create" element={
                        <ProtectedRoute roles={['owner']}>
                            <OfferForm isUpdate={false} />
                        </ProtectedRoute>
                    } />
                    <Route path="/offers/:id/update" element={
                        <ProtectedRoute roles={['owner']}>
                            <OfferForm isUpdate={true} />
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute roles={['owner']}>
                            <RatingsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/unauthorized" element={<ForbiddenPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default AppRoutes;