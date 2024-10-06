import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, deleteAppointment, updateAppointment } from '../../api/appointments.api';
import { getAllClients } from '../../api/clients.api';
import { getAllWorkers } from '../../api/workers.api';
import { getAllServices } from '../../api/services.api'; // Importar la función para obtener los servicios
import { getSchedulesAvailablesByDate } from '../../api/schedules.api';
import { Button, TextField, Box, Card, CardContent, CardHeader, Grid, Dialog, DialogActions, DialogContent, DialogContentText, CircularProgress, FormControl, InputLabel, Select, MenuItem, Alert, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export function AppointmentDetailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [clients, setClients] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [services, setServices] = useState([]); // Estado para los servicios
    const [openDialog, setOpenDialog] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [initialTime, setInitialTime] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getAppointment(id);
                const appointmentData = response.data;
                if (appointmentData && appointmentData.schedule) {
                    setAppointment({
                        description: appointmentData.description,
                        status: appointmentData.status,
                        client: appointmentData.client.id,
                        clientName: appointmentData.client.user.username, // Añadir el nombre del cliente
                        worker: appointmentData.worker.id,
                        service: appointmentData.service.id, // Añadir el servicio a la cita
                        schedule: {
                            id: appointmentData.schedule.id,
                            date: moment(appointmentData.schedule.date).format('YYYY-MM-DD'),
                            start_time: appointmentData.schedule.start_time,
                            end_time: appointmentData.schedule.end_time
                        },
                        modality: appointmentData.modality,
                    });
                    setInitialTime({
                        start_time: appointmentData.schedule.start_time,
                        end_time: appointmentData.schedule.end_time
                    });
                } else {
                    console.error('Appointment data or schedule is missing');
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };

        const fetchClientsWorkersAndServices = async () => {
            try {
                const clientsResponse = await getAllClients();
                const workersResponse = await getAllWorkers();
                const servicesResponse = await getAllServices(); // Obtener los servicios
                setClients(clientsResponse.data);
                setWorkers(workersResponse.data);
                setServices(servicesResponse.data); // Establecer los servicios
            } catch (error) {
                console.error('Error fetching clients, workers or services:', error);
            }
        };

        fetchAppointment();
        fetchClientsWorkersAndServices();
    }, [id]);

    useEffect(() => {
        if (appointment && appointment.schedule.date) {
            const loadAvailableTimes = async () => {
                try {
                    const response = await getSchedulesAvailablesByDate(appointment.schedule.date);
                    const times = response.data;
                    const uniqueTimes = times.filter((time, index, self) =>
                        index === self.findIndex((t) => (
                            t.start_time === time.start_time && t.end_time === time.end_time
                        ))
                    );
                    setAvailableTimes(uniqueTimes);
                } catch (error) {
                    console.error("Error loading available times", error);
                    setAvailableTimes([]);
                }
            };
            loadAvailableTimes();
        }
    }, [appointment && appointment.schedule.date]);

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
            const updatedAppointment = {
                ...appointment,
                schedule: {
                    id: appointment.schedule.id,
                    date: appointment.schedule.date,
                    start_time: appointment.schedule.start_time,
                    end_time: appointment.schedule.end_time,
                },
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

    const handleDateChange = async (date) => {
        handleChange('schedule', { ...appointment.schedule, date });
        try {
            const response = await getSchedulesAvailablesByDate(date);
            const times = response.data;
            const uniqueTimes = times.filter((time, index, self) =>
                index === self.findIndex((t) => (
                    t.start_time === time.start_time && t.end_time === time.end_time
                ))
            );
            setAvailableTimes(uniqueTimes);
        } catch (error) {
            console.error("Error loading available times", error);
            setAvailableTimes([]);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Card sx={{ mt: 2 }}>
                <CardHeader title={t('appointment_detail_title')} sx={{ textAlign: 'center' }} />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={t('client_label')}
                                value={appointment.clientName}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>{t('worker_label')}</InputLabel>
                                <Select
                                    value={appointment.worker}
                                    onChange={e => handleChange('worker', e.target.value)}
                                    label={t('worker_label')}
                                >
                                    {workers.map(worker => (
                                        <MenuItem key={worker.id} value={worker.id}>
                                            {worker.user.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>{t('service_label')}</InputLabel>
                                <Select
                                    value={appointment.service}
                                    onChange={e => handleChange('service', e.target.value)}
                                    label={t('service_label')}
                                >
                                    {services.map(service => (
                                        <MenuItem key={service.id} value={service.id}>
                                            {service.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label={t('modality_label')}
                                value={appointment.modality === 'VIRTUAL' ? t('virtual') : t('in_person')}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label={t('reason_label')} value={appointment.description} onChange={e => handleChange('description', e.target.value)} disabled />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                type="date"
                                fullWidth
                                label={t('date')}
                                value={appointment.schedule.date}
                                onChange={e => handleDateChange(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {appointment.schedule.date && (availableTimes.length > 0 ? (
                                <FormControl fullWidth>
                                    <InputLabel id="schedule-label">{t('available_schedules_label')}</InputLabel>
                                    <Select
                                        labelId="schedule-label"
                                        value={appointment.schedule.start_time}
                                        onChange={(e) => {
                                            const selectedTime = availableTimes.find(time => time.start_time === e.target.value);
                                            if (selectedTime) {
                                                handleChange('schedule', {
                                                    ...appointment.schedule,
                                                    id: selectedTime.id,
                                                    start_time: selectedTime.start_time,
                                                    end_time: selectedTime.end_time
                                                });
                                            }
                                        }}
                                        label={t('available_schedules_label')}
                                    >
                                        <MenuItem value={initialTime.start_time}>
                                            {initialTime.start_time.split(':').slice(0, 2).join(':')} - {initialTime.end_time.split(':').slice(0, 2).join(':')}
                                        </MenuItem>
                                        {availableTimes.map((time, index) => (
                                            <MenuItem key={index} value={time.start_time}>{time.start_time.split(':').slice(0, 2).join(':')} - {time.end_time.split(':').slice(0, 2).join(':')}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : <Alert severity="warning" className="mb-2">{t('no_schedules_available')}</Alert>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="status-label">{t('status_label')}</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={appointment.status}
                                    onChange={e => handleChange('status', e.target.value)}
                                    label={t('status_label')}
                                >
                                    <MenuItem value="CONFIRMED">{t('confirmed')}</MenuItem>
                                    <MenuItem value="COMPLETED">{t('completed')}</MenuItem>
                                    <MenuItem value="CANCELLED">{t('cancelled')}</MenuItem>
                                </Select>
                            </FormControl>
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
        </Box>
    );
}