import React from 'react';
import { Tab, Tabs, Button } from 'react-bootstrap';
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
            <Tabs defaultActiveKey={activeTab} id="uncontrolled-tab-example">
                <Tab eventKey="workers" title="Workers">
                    <Button onClick={handleCreateWorker}>Create Worker</Button>
                    <WorkersList />
                </Tab>
                <Tab eventKey="clients" title="Clients">
                    <Button onClick={handleCreateClient}>Create Client</Button>
                    <ClientsList />
                </Tab>
            </Tabs>
        </div>
    );
}