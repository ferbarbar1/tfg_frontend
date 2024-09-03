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
import { ChatPage } from './pages/chat/ChatPage';
import { ErrorPage } from './pages/ErrorPage';
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { HomePage } from "./pages/HomePage";
import { Layout } from './pages/Layout';
import { OffersPage } from './pages/offers/OffersPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ServiceDetailPage } from "./pages/services/ServiceDetailPage";
import { ServiceFormPage } from "./pages/services/ServiceFormPage";
import { ServicesPage } from "./pages/services/ServicesPage";
import { ClientDetailPage } from "./pages/users/ClientDetailPage";
import { ProfilePage } from "./pages/users/ProfilePage";
import { UsersPage } from "./pages/users/UsersPage";
import { WorkerDetailPage } from "./pages/users/WorkerDetailPage";
import { VideoCallPage } from './pages/appointments/VideoCallPage';
import { UpdateProfileForm } from './components/users/UpdateProfileForm';
import { NotificationsList } from './components/notifications/NotificationsList';
import './styles/AppRoutes.css';
import { ProfileInformationPage } from './pages/users/ProfileInformationPage';
import { ResourcesPage } from './pages/clinical_resources/ResourcesPage';
import { ResourceForm } from './components/clinical_resources/ResourceForm';
import { ChangePasswordAuth } from './components/profile/ChangePasswordAuth';
import { ChangePasswordUnauth } from './components/profile/ChangePasswordUnauth';
import { PasswordResetRequest } from './components/profile/PasswordResetRequest';
import { ServicesRatingsPage } from './pages/services/ServicesRatingsPage';

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
                    <Route path="/services/:id/ratings" element={
                        <ProtectedRoute roles={['client']}>
                            <ServicesRatingsPage />
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
                    <Route path="/appointments/:id/video-call" element={
                        <ProtectedRoute roles={['owner', 'worker', 'client']}>
                            <VideoCallPage />
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
                            <AnalyticsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/chat/:conversationId?" element={
                        <ProtectedRoute roles={['owner', 'worker', 'client']}>
                            <ChatPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile/:userId" element={
                        <ProtectedRoute roles={['owner', 'worker', 'client']}>
                            <ProfileInformationPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-profile" element={
                        <ProtectedRoute roles={['owner', 'worker', 'client']}>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-profile/update" element={
                        <ProtectedRoute roles={['client', 'worker']}>
                            <UpdateProfileForm />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-profile/password-reset" element={
                        <ProtectedRoute roles={['owner', 'client', 'worker']}>
                            <ChangePasswordAuth />
                        </ProtectedRoute>
                    } />
                    <Route path="/password-reset" element={<PasswordResetRequest />} />
                    <Route path="/reset/:uid/:token" element={<ChangePasswordUnauth />} />
                    <Route path="/my-notifications" element={
                        <ProtectedRoute roles={['owner', 'client', 'worker']}>
                            <NotificationsList />
                        </ProtectedRoute>
                    } />
                    <Route path="/resources" element={
                        <ProtectedRoute roles={['owner', 'client', 'worker']}>
                            <ResourcesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/resources/create" element={
                        <ProtectedRoute roles={['owner', 'worker']}>
                            <ResourceForm isUpdate={false} />
                        </ProtectedRoute>
                    } />
                    <Route path="/resources/:id/update" element={
                        <ProtectedRoute roles={['owner', 'worker']}>
                            <ResourceForm isUpdate={true} />
                        </ProtectedRoute>
                    } />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/unauthorized" element={<ForbiddenPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default AppRoutes;