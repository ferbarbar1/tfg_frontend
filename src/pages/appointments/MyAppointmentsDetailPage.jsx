import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, updateAppointment } from '../../api/appointments.api';
import { Typography, Divider, Button, TextField, Box, Card, CardContent, Grid, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
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
    const statusOptions = [
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'COMPLETED', label: 'Completed' },
    ];

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
                        meeting_link: appointmentData.meeting_link,
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

    const handleUpdate = async () => {
        try {
            const updatedAppointment = {
                ...appointment,
                status: appointment.status,
            };

            await updateAppointment(id, updatedAppointment);
            navigate('/my-appointments/');
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const handleZoomAuth = () => {
        const clientId = 'd0NInwj3Q3SFiF09kf9c8w';
        const redirectUri = encodeURIComponent('http://127.0.0.1:8000/api/oauth/callback');
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
        window.location.href = zoomAuthUrl;
    };

    const handleChange = (field, value) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
    };

    const closeModal = () => {
        setShowModal(false);
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
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status"
                                value={appointment.status}
                                label="Status"
                                onChange={(e) => handleChange('status', e.target.value)}
                                disabled={user.user.role !== 'worker'}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Modality" value={appointment.modality} disabled />
                    </Grid>
                    {appointment.modality === 'VIRTUAL' && appointment.meeting_link && (
                        <Grid item xs={12}>
                            <TextField fullWidth label="Meeting Link" value={appointment.meeting_link} disabled />
                        </Grid>
                    )}
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
                    {user.user.role === 'worker' && (
                        <>
                            <Button variant="contained" color="primary" sx={{ marginRight: 1 }} onClick={handleUpdate}>Update</Button>
                            {appointment.modality === 'VIRTUAL' && appointment.status === 'CONFIRMED' && (
                                <Button variant="contained" color="secondary" sx={{ marginRight: 1 }} onClick={handleZoomAuth}>Create Meeting</Button>
                            )}
                            {appointment.status === 'COMPLETED' && (
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
                    {appointment.inform && (
                        <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>Show Inform</Button>
                    )}
                    <Button variant="contained" color="error" onClick={() => navigate('/my-appointments')}>Back</Button>
                </Box>
            </CardContent>
        </Card>
    );
}
