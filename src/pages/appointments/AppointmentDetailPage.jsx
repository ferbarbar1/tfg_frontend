import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, deleteAppointment, updateAppointment } from '../../api/appointments.api';
import { Typography, Divider, Button, TextField, Box, Card, CardContent, Grid } from '@mui/material';

export function AppointmentDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getAppointment(id);
                const appointmentData = response.data;
                if (appointmentData && appointmentData.schedule) {
                    setAppointment({
                        description: appointmentData.description,
                        status: appointmentData.status,
                        client: appointmentData.client,
                        worker: appointmentData.worker,
                        schedule: {
                            date: appointmentData.schedule.date,
                            time: `${appointmentData.schedule.start_time.split(':').slice(0, 2).join(':')} - ${appointmentData.schedule.end_time.split(':').slice(0, 2).join(':')}`
                        },
                        modality: appointmentData.modality,
                    });
                } else {
                    console.error('Appointment data or schedule is missing');
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

    const handleDelete = async () => {
        try {
            await deleteAppointment(id);
            navigate('/appointments');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async () => {
        try {
            const [start_time, end_time] = appointment.schedule.time.split(' - ');
            const updatedAppointment = {
                ...appointment,
                schedule: { date: appointment.schedule.date, start_time, end_time },
            };

            await updateAppointment(id, updatedAppointment);
            navigate('/appointments/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (field, value) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
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
                        <TextField fullWidth label="Client" value={appointment.client.user.username} onChange={e => handleChange('client', e.target.value)} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Worker" value={appointment.worker.user.username} onChange={e => handleChange('worker', e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Reason" value={appointment.description} onChange={e => handleChange('description', e.target.value)} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Date" value={appointment.schedule.date} onChange={e => handleChange('schedule', { ...appointment.schedule, date: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Time" value={appointment.schedule.time} onChange={e => handleChange('schedule', { ...appointment.schedule, time: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Status" value={appointment.status} onChange={e => handleChange('status', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Modality" value={appointment.modality} onChange={e => handleChange('modality', e.target.value)} />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, marginTop: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ marginRight: 1 }}>Update</Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
                </Box>
            </CardContent>
        </Card>
    );
}