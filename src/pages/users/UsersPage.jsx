import React from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { UsersList } from '../../components/users/UsersList';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllClients } from '../../api/clients.api';
import { getAllWorkers } from '../../api/workers.api';

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
                    <UsersList userType="workers" fetchUsers={getAllWorkers} />
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleCreateWorker}>
                            Create Worker
                        </Button>
                    </Box>
                </div>
            )}
            {activeTab === 'clients' && (
                <div>
                    <UsersList userType="clients" fetchUsers={getAllClients} />
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