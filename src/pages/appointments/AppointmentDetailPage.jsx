import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, deleteAppointment, updateAppointment } from '../../api/appointments.api';
import { Button, TextField, Box, Card, CardContent, Grid, Dialog, DialogActions, DialogContent, DialogContentText, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function AppointmentDetailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isModified, setIsModified] = useState(false);

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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleDelete = () => {
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteAppointment(id);
            navigate('/appointments');
            setOpenDialog(false);
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
        setIsModified(true);
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('client_label')} value={appointment.client.user.username} onChange={e => handleChange('client', e.target.value)} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('worker_label')} value={appointment.worker.user.username} onChange={e => handleChange('worker', e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={t('reason_label')} value={appointment.description} onChange={e => handleChange('description', e.target.value)} disabled />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('date')} value={appointment.schedule.date} onChange={e => handleChange('schedule', { ...appointment.schedule, date: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('time_label')} value={appointment.schedule.time} onChange={e => handleChange('schedule', { ...appointment.schedule, time: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('status_label')} value={appointment.status} onChange={e => handleChange('status', e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label={t('modality_label')} value={appointment.modality} onChange={e => handleChange('modality', e.target.value)} disabled />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, marginTop: 2 }}>
                    {isModified && (
                        <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ marginRight: 1 }}>{t('update_button')}</Button>
                    )}
                    <Button variant="contained" color="error" onClick={handleDelete}>{t('delete_button')}</Button>
                </Box>
            </CardContent>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('confirm_delete')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        {t('cancel_button')}
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        {t('confirm_button')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}