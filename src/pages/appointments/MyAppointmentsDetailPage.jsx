import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment } from '../../api/appointments.api';
import { Typography, Divider, Button, TextField, Box, Card, CardContent, Grid, Modal } from '@mui/material';
import { RateAppointmentForm } from '../../components/ratings/RateAppointmentForm';
import { InformForm } from '../../components/informs/InformForm';
import { AuthContext } from '../../contexts/AuthContext';

export function MyAppointmentsDetailPage() {
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
        return <div>Loading...</div>;
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
                    Details
                </Typography>
                <Divider sx={{ marginBottom: 3, bgcolor: 'black' }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Client" value={appointment.client.user.username} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Worker" value={appointment.worker.user.username} disabled />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Reason" value={appointment.description} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Date" value={appointment.schedule.date} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Time" value={appointment.schedule.time} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Status" value={appointment.status} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Modality" value={appointment.modality} disabled />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, marginTop: 2 }}>
                    {user.user.role === 'client' && appointment.status === 'COMPLETED' && (
                        <>
                            <Button variant="contained" sx={{ marginRight: 1 }} onClick={() => { setAppointmentId(appointment.id); setIsUpdate(true); setShowModal(true); }}>Rate</Button>
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
                            Join Video Call
                        </Button>
                    )}
                    {user.user.role === 'worker' && (
                        <>
                            {appointment.modality === 'IN_PERSON' && (
                                <>
                                    <Button variant="contained" color="inherit" sx={{ marginRight: 1 }} onClick={() => { setAppointmentId(appointment.id); setShowModal(true); }}>Attach report</Button>
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
                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }} onClick={handleShowInform}>Show Inform</Button>
                    )}
                    <Button variant="contained" color="error" onClick={() => navigate('/my-appointments')}>Back</Button>
                </Box>
            </CardContent>
        </Card>
    );
}
