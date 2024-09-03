import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAppointment } from '../../api/appointments.api';
import { Typography, Divider, Button, TextField, Box, Card, CardContent, Grid, Modal } from '@mui/material';
import { RateAppointmentForm } from '../../components/ratings/RateAppointmentForm';
import { InformForm } from '../../components/informs/InformForm';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function MyAppointmentsDetailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [appointment, setAppointment] = useState(null);
    const [appointmentId, setAppointmentId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getAppointment(id);
                const appointmentData = response.data;
                if (appointmentData) {
                    setAppointment({
                        id: appointmentData.id,
                        description: appointmentData.description,
                        status: appointmentData.status,
                        client: appointmentData.client,
                        worker: appointmentData.worker,
                        schedule: {
                            date: appointmentData.schedule.date,
                            time: `${appointmentData.schedule.start_time.split(':').slice(0, 2).join(':')} - ${appointmentData.schedule.end_time.split(':').slice(0, 2).join(':')}`
                        },
                        modality: appointmentData.modality,
                        inform: appointmentData.inform,
                    });
                } else {
                    console.error('Appointment data is missing');
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };

        fetchAppointment();
    }, [id]);

    if (!appointment) {
        return <div>{t('loading')}</div>;
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const handleShowInform = () => {
        navigate(`/appointments/${appointment.id}/inform`);
    };

    const handleStartVideoCall = () => {
        navigate(`/appointments/${id}/video-call`);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom align="center">
                    {t('details')}
                </Typography>
                <Divider sx={{ marginBottom: 3, bgcolor: 'black' }} />
                <Grid container spacing={2}>
                    {user.user.role === 'worker' &&
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={t('client_label')}
                                value={appointment.client.user.username}
                                disabled
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            component={Link}
                                            to={`/profile/${appointment.client.id}`}
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                        >
                                            {t('view_profile')}
                                        </Button>
                                    ),
                                }}
                            />
                        </Grid>
                    }
                    {user.user.role === 'client' &&
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={t('worker_label')}
                                value={appointment.worker.user.username}
                                disabled
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            component={Link}
                                            to={`/profile/${appointment.worker.id}`}
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                        >
                                            {t('view_profile')}
                                        </Button>
                                    ),
                                }}
                            />
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <TextField fullWidth label={t('reason_label')} value={appointment.description} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('date')} value={appointment.schedule.date} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('time_label')} value={appointment.schedule.time} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('status_label')} value={appointment.status} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('modality_label')} value={appointment.modality} disabled />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, marginTop: 2 }}>
                    {user.user.role === 'client' && appointment.status === 'COMPLETED' && (
                        <>
                            <Button variant="contained" sx={{ marginRight: 1 }} onClick={() => { setAppointmentId(appointment.id); setIsUpdate(true); setShowModal(true); }}>{t('rate_button')}</Button>
                            <Modal
                                open={showModal}
                                onClose={closeModal}
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
                                    <RateAppointmentForm appointmentId={appointmentId} closeModal={closeModal} isUpdate={isUpdate} />
                                </Box>
                            </Modal>
                        </>
                    )}
                    {appointment.modality === 'VIRTUAL' && appointment.status === 'CONFIRMED' && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleStartVideoCall}
                            sx={{ marginRight: 1 }}
                        >
                            {t('join_video_call')}
                        </Button>
                    )}
                    {user.user.role === 'worker' && (
                        <>
                            {appointment.modality === 'IN_PERSON' && (
                                <>
                                    <Button variant="contained" color="inherit" sx={{ marginRight: 1 }} onClick={() => { setAppointmentId(appointment.id); setShowModal(true); }}>{t('attach_report')}</Button>
                                    <Modal
                                        open={showModal}
                                        onClose={closeModal}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={{
                                            width: '100%',
                                            maxWidth: '600px',
                                            margin: 'auto',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            mt: 6
                                        }}>
                                            <InformForm appointmentId={appointmentId} closeModal={closeModal} />
                                        </Box>
                                    </Modal>
                                </>
                            )}
                        </>
                    )}
                    {appointment.inform !== null && (
                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }} onClick={handleShowInform}>{t('show_inform')}</Button>
                    )}
                    <Button variant="contained" color="error" onClick={() => navigate('/my-appointments')}>{t('back')}</Button>
                </Box>
            </CardContent>
        </Card>
    );
}