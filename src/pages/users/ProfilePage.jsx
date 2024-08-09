import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Typography, Card, CardContent, Divider, Button, Grid, Box, Modal, Link, IconButton } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { MedicalHistoryForm } from '../../components/informs/MedicalHistoryForm';
import { getAllMedicalHistoriesByClient, deleteMedicalHistory } from '../../api/medical_histories.api';
import EmailIcon from '@mui/icons-material/Email';
import SubscriptionIcon from '@mui/icons-material/Subscriptions';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

export const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [medicalHistories, setMedicalHistories] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchMedicalHistories = async () => {
                try {
                    const response = await getAllMedicalHistoriesByClient(user.id);
                    setMedicalHistories(response.data);
                } catch (error) {
                    console.error('Error fetching medical histories:', error);
                    setMedicalHistories([]);
                }
            };

            fetchMedicalHistories();
        }
    }, [user, medicalHistories]);

    const handleDelete = async (id) => {
        try {
            await deleteMedicalHistory(id);
            setMedicalHistories(medicalHistories.filter(history => history.id !== id));
        } catch (error) {
            console.error('Error deleting medical history:', error);
        }
    };

    if (!user) {
        return <Typography variant="h4">Please, log in to see your profile.</Typography>;
    }

    return (
        <Grid container spacing={3} justifyContent="center" sx={{ padding: 3 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Card sx={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            src={user?.user?.image || ''}
                            alt={`${user?.user?.first_name || ''} ${user?.user?.last_name || ''}`}
                            sx={{
                                width: 160,
                                height: 160,
                                marginBottom: 2
                            }}
                            onError={(e) => { console.log('Image load error', e); }}
                        />
                        <Divider sx={{ width: '100%', my: 2 }} />
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h4" component="h1" textAlign="center">
                                {user?.user?.first_name} {user?.user?.last_name}
                            </Typography>
                            <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="p" sx={{ marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon sx={{ marginRight: 1 }} /> {user?.user?.email}
                                </Typography>
                                {user?.user?.role === 'client' && (
                                    <Typography variant="subtitle1" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SubscriptionIcon sx={{ marginRight: 1 }} /> Subscription Plan: {user?.subscription_plan}
                                    </Typography>
                                )}
                                {user?.user?.role === 'worker' && (
                                    <Typography variant="subtitle1" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EngineeringIcon sx={{ marginRight: 1 }} /> Specialty: {user?.specialty}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" color="primary" sx={{ marginTop: 6, marginRight: 2 }} onClick={() => { setShowModal(true) }}>
                                    Add medical histories
                                </Button>
                                <Modal
                                    open={showModal}
                                    onClose={() => setShowModal(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        margin: 'auto',
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 4,
                                        mt: 6
                                    }}>
                                        <MedicalHistoryForm closeModal={() => setShowModal(false)} />
                                    </Box>
                                </Modal>
                                <Button variant="contained" color="primary" sx={{ marginTop: 6 }}>
                                    Update
                                </Button>
                            </Box>
                            {user?.user?.role === 'client' && medicalHistories && medicalHistories.length > 0 && (
                                <>
                                    <Divider sx={{ width: '100%', my: 2 }} />
                                    <Typography variant="h6" component="h2" textAlign="center">
                                        Medical Histories
                                    </Typography>
                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {medicalHistories.map((history, index) => (
                                            <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="h6" component="h3">
                                                    {history.description}
                                                    <Link href={history.medical_report} target="_blank" sx={{ marginLeft: 1 }}>
                                                        <InsertDriveFileIcon />
                                                    </Link>
                                                    <IconButton onClick={() => handleDelete(history.id)} sx={{ marginLeft: 1 }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};