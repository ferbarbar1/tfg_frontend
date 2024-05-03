import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { WorkersList } from '../../components/users/WorkersList';
import { ClientsList } from '../../components/users/ClientsList';
import { useNavigate, useLocation } from 'react-router-dom';

export function UsersPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const activeTab = queryParams.get('tab') || 'workers';

    const handleCreateClient = () => {
        navigate('/clients/create');
    };

    const handleCreateWorker = () => {
        navigate('/workers/create');
    };

    return (
        <div>
            <h1>Users Page</h1>
            <Tabs defaultActiveKey={activeTab} id="uncontrolled-tab-example">
                <Tab eventKey="workers" title="Workers">
                    <button onClick={handleCreateWorker}>Create Worker</button>
                    <WorkersList />
                </Tab>
                <Tab eventKey="clients" title="Clients">
                    <button onClick={handleCreateClient}>Create Client</button>
                    <ClientsList />
                </Tab>
            </Tabs>
        </div>
    );
}