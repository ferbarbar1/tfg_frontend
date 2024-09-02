import React, { useState, useContext } from 'react';
import { Typography, Tabs, Tab } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { UserInformation } from '../../components/profile/UserInformation';
import { MedicalHistoriesList } from '../../components/profile/MedicalHistoriesList';
import { InformsList } from '../../components/profile/InformsList';

export const ProfilePage = ({ userData }) => {
    const { user: authUser } = useContext(AuthContext);
    const user = userData || authUser;
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (!user) {
        return <Typography variant="h4">Please, log in to see your profile.</Typography>;
    }

    if (user.user.role === 'worker' || user.user.role === 'owner') {
        return <UserInformation user={user} />;
    }


    return (
        <>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Profile" />
                <Tab label="Medical Histories" />
                <Tab label="Informs" />
            </Tabs>
            {activeTab === 0 && <UserInformation user={user} />}
            {activeTab === 1 && <MedicalHistoriesList user={user} />}
            {activeTab === 2 && <InformsList user={user} />}
        </>
    );
};