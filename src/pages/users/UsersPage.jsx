import React from 'react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { UsersList } from '../../components/users/UsersList';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllClients } from '../../api/clients.api';
import { getAllWorkers } from '../../api/workers.api';
import { useTranslation } from 'react-i18next';

export function UsersPage() {
    const { t } = useTranslation();
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
        <>
            <Tabs value={activeTab} onChange={handleChange}>
                <Tab value="workers" label={t('workers_tab')} />
                <Tab value="clients" label={t('clients_tab')} />
            </Tabs>
            {activeTab === 'workers' && (
                <>
                    <UsersList userType="workers" fetchUsers={getAllWorkers} />
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleCreateWorker}>
                            {t('create_worker_button')}
                        </Button>
                    </Box>
                </>
            )}
            {activeTab === 'clients' && (
                <>
                    <UsersList userType="clients" fetchUsers={getAllClients} />
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Button variant="contained" color="primary" onClick={handleCreateClient}>
                            {t('create_client_button')}
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
}