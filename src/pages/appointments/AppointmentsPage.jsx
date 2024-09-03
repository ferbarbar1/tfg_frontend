import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllAppointments, getAppointmentsByWorker } from '../../api/appointments.api';
import { useNavigate } from 'react-router-dom';
import { Modal, Container, Paper, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { AppointmentForm } from '../../components/appointments/AppointmentForm';
import { getAllWorkers } from '../../api/workers.api';
import { useTranslation } from 'react-i18next';

const localizer = momentLocalizer(moment);

export function AppointmentsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await getAllWorkers();
                setWorkers(response.data);
            } catch (error) {
                console.error('Error fetching workers:', error);
            }
        };

        fetchWorkers();
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response;
                if (selectedWorker) {
                    response = await getAppointmentsByWorker(selectedWorker);
                } else {
                    response = await getAllAppointments();
                }
                const appointments = response.data;

                const formattedEvents = appointments.map(appointment => {
                    const schedule = appointment.schedule;

                    if (schedule && schedule.date && schedule.start_time && schedule.end_time) {
                        return {
                            id: appointment.id,
                            start: moment(`${schedule.date}T${schedule.start_time}`).toDate(),
                            end: moment(`${schedule.date}T${schedule.end_time}`).toDate(),
                            title: `${t('appointment')} ${appointment.id}: ${appointment.description}`
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
        };

        fetchAppointments();
    }, [selectedWorker, t]);

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

    const clearSelectedWorker = () => {
        setSelectedWorker('');
    };

    return (
        <Container maxWidth="md" className='mt-3'>
            <FormControl fullWidth sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <InputLabel id="worker-select-label">{t('select_worker')}</InputLabel>
                <Select
                    labelId="worker-select-label"
                    label={t('select_worker')}
                    value={selectedWorker}
                    onChange={handleWorkerChange}
                    sx={{ flex: 1, maxWidth: '210px' }}
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
                {selectedWorker && (
                    <IconButton onClick={clearSelectedWorker} sx={{ ml: 1 }}>
                        <ClearIcon />
                    </IconButton>
                )}
            </FormControl>
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
                    <AppointmentForm closeModal={closeModal} selectedSlot={selectedSlot} />
                </Paper>
            </Modal>
        </Container>
    );
}