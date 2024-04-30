import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ClientDetailPage } from "./pages/ClientDetailPage";
import { WorkerDetailPage } from "./pages/WorkerDetailPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { Sidebar } from "./components/Sidebar";
import { RatingsPage } from "./pages/RatingsPage";
import './styles/AppRoutes.css';

const AppRoutes = () => (
    <Router>
        <div className="app-container">
            <Sidebar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/create" element={<ServiceDetailPage isUpdate={false} />} />
                    <Route path="/services/:id/update" element={<ServiceDetailPage isUpdate={true} />} />
                    <Route path="/clients/create" element={<ClientDetailPage isUpdate={false} />} />
                    <Route path="/clients/:id/update" element={<ClientDetailPage isUpdate={true} />} />
                    <Route path="/workers/create" element={<WorkerDetailPage isUpdate={false} />} />
                    <Route path="/workers/:id/update" element={<WorkerDetailPage isUpdate={true} />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
                    <Route path="/analytics" element={<RatingsPage />} />

                </Routes>
            </div>
        </div>
    </Router>
);

export default AppRoutes;