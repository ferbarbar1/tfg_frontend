import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import { getClient } from '../../api/clients.api';
import { getWorker } from '../../api/workers.api';
import { AuthContext } from '../../contexts/AuthContext';
import { ProfilePage } from './ProfilePage';
import { useTranslation } from 'react-i18next';

export const ProfileInformationPage = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user.user.role === 'worker') {
                    const clientResponse = await getClient(userId);
                    setUserData(clientResponse.data);
                } else if (user.user.role === 'client') {
                    const workerResponse = await getWorker(userId);
                    setUserData(workerResponse.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId, user.user.role]);

    if (!userData) {
        return <Typography variant="h4">
            {t('loading')}
        </Typography>;
    }

    return <ProfilePage userData={userData} />;
};