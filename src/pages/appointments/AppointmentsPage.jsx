import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllAppointments, getAppointmentsByWorker, getAppointmentsByService, getAppointmentsByWorkerAndService } from '../../api/appointments.api';
import { useNavigate } from 'react-router-dom';
import { Modal, Container, Paper, Select, MenuItem, FormControl, InputLabel, IconButton, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { AppointmentForm } from '../../components/appointments/AppointmentForm';
import { getAllWorkers } from '../../api/workers.api';
import { getAllServices } from '../../api/services.api';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

export function AppointmentsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [selectedService, setSelectedService] = useState('');

    const fetchWorkers = useCallback(async () => {
        try {
            const response = await getAllWorkers();
            setWorkers(response.data);
        } catch (error) {
            console.error('Error fetching workers:', error);
        }
    }, []);

    const fetchServices = useCallback(async () => {
        try {
            const response = await getAllServices();
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }, []);

    const fetchAppointments = useCallback(async () => {
        try {
            let response;
            if (selectedWorker && selectedService) {
                response = await getAppointmentsByWorkerAndService(selectedService, selectedWorker);
            } else if (selectedWorker) {
                response = await getAppointmentsByWorker(selectedWorker);
            } else if (selectedService) {
                response = await getAppointmentsByService(selectedService);
            } else {
                response = await getAllAppointments();
            }
            const appointments = response.data;

            const formattedEvents = appointments.map(appointment => {
                const schedule = appointment.schedule;
                const client = appointment.client;

                if (schedule && schedule.date && schedule.start_time && schedule.end_time) {
                    return {
                        id: appointment.id,
                        start: moment(`${schedule.date}T${schedule.start_time}`).toDate(),
                        end: moment(`${schedule.date}T${schedule.end_time}`).toDate(),
                        title: `${t('appointment')} ${appointment.id}: ${client.user.first_name} ${client.user.last_name}`
                    };
                } else {
                    console.error('Invalid appointment or schedule data:', appointment);
                    return null;
                }
            });

            setEvents(formattedEvents.filter(event => event !== null));
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }, [selectedWorker, selectedService, t]);

    useEffect(() => {
        fetchWorkers();
        fetchServices();
    }, [fetchWorkers, fetchServices]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setAppointmentModalOpen(true);
    };

    const closeModal = () => {
        setAppointmentModalOpen(false);
    };

    const handleWorkerChange = (event) => {
        setSelectedWorker(event.target.value);
    };

    const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
    };

    const clearSelectedWorker = () => {
        setSelectedWorker('');
    };

    const clearSelectedService = () => {
        setSelectedService('');
    };

    return (
        <Container maxWidth="md" className='mt-3'>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="worker-select-label">{t('select_worker')}</InputLabel>
                        <Select
                            labelId="worker-select-label"
                            label={t('select_worker')}
                            value={selectedWorker}
                            onChange={handleWorkerChange}
                        >
                            <MenuItem value="">
                                <em>{t('all_workers')}</em>
                            </MenuItem>
                            {workers.map(worker => (
                                <MenuItem key={worker.id} value={worker.id}>
                                    {worker.user.first_name} {worker.user.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedWorker && (
                        <IconButton onClick={clearSelectedWorker} sx={{ ml: 1 }}>
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="service-select-label">{t('select_service')}</InputLabel>
                        <Select
                            labelId="service-select-label"
                            label={t('select_service')}
                            value={selectedService}
                            onChange={handleServiceChange}
                        >
                            <MenuItem value="">
                                <em>{t('all_services')}</em>
                            </MenuItem>
                            {services.map(service => (
                                <MenuItem key={service.id} value={service.id}>
                                    {service.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedService && (
                        <IconButton onClick={clearSelectedService} sx={{ ml: 1 }}>
                            <ClearIcon />
                        </IconButton>
                    )}
                </Box>
            </Box>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, width: '100%' }}
                onSelectEvent={event => {
                    navigate(`/appointments/${event.id}/details`);
                }}
                onSelectSlot={handleSelectSlot}
                selectable={true}
                defaultView='week'
                min={new Date(0, 0, 0, 9, 0, 0)}
                max={new Date(0, 0, 0, 20, 0, 0)}
            />
            <Modal
                open={appointmentModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper elevation={3} sx={{ width: '100%', maxWidth: '400px', p: 2, margin: 'auto', mt: 2 }}>
                    <AppointmentForm closeModal={closeModal} selectedSlot={selectedSlot} fetchAppointments={fetchAppointments} />
                </Paper>
            </Modal>
        </Container>
    );
}