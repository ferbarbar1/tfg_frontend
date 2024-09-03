import React, { useState, useContext } from 'react';
import { Typography, Tabs, Tab } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { UserInformation } from '../../components/profile/UserInformation';
import { MedicalHistoriesList } from '../../components/profile/MedicalHistoriesList';
import { InformsList } from '../../components/profile/InformsList';
import { useTranslation } from 'react-i18next';

export const ProfilePage = ({ userData }) => {
    const { t } = useTranslation();
    const { user: authUser } = useContext(AuthContext);
    const user = userData || authUser;
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (!user) {
        return <Typography variant="h4">{t('please_log_in')}</Typography>;
    }

    if (user.user.role === 'worker' || user.user.role === 'owner') {
        return <UserInformation user={user} />;
    }

    return (
        <>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label={t('profile_tab')} />
                <Tab label={t('medical_histories_tab')} />
                <Tab label={t('informs_tab')} />
            </Tabs>
            {activeTab === 0 && <UserInformation user={user} />}
            {activeTab === 1 && <MedicalHistoriesList user={user} />}
            {activeTab === 2 && <InformsList user={user} />}
        </>
    );
};