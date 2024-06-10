import React from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
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

    const handleChange = (event, newValue) => {
        navigate(`?tab=${newValue}`);
    };

    return (
        <div>
            <Tabs value={activeTab} onChange={handleChange}>
                <Tab value="workers" label="Workers" />
                <Tab value="clients" label="Clients" />
            </Tabs>
            {activeTab === 'workers' && (
                <div>
                    <WorkersList />
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleCreateWorker}>
                            Create Worker
                        </Button>
                    </Box>
                </div>
            )}
            {activeTab === 'clients' && (
                <div>
                    <ClientsList />
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleCreateClient}>
                            Create Client
                        </Button>
                    </Box>
                </div>
            )}
        </div>
    );
}