import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllAppointments } from '../../api/appointments.api';
import { useNavigate } from 'react-router-dom';
import { Modal, Container, Paper } from '@mui/material';
import { AppointmentForm } from '../../components/appointments/AppointmentForm';

const localizer = momentLocalizer(moment);

export function AppointmentsPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAllAppointments();
                const appointments = response.data;

                const formattedEvents = appointments.map(appointment => {
                    const schedule = appointment.schedule;

                    if (schedule && schedule.date && schedule.start_time && schedule.end_time) {
                        return {
                            id: appointment.id,
                            start: moment(`${schedule.date}T${schedule.start_time}`).toDate(),
                            end: moment(`${schedule.date}T${schedule.end_time}`).toDate(),
                            title: `Appointment ${appointment.id}: ${appointment.description}`
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
    }, []);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setAppointmentModalOpen(true);
    };

    const closeModal = () => {
        setAppointmentModalOpen(false);
    };

    return (
        <Container maxWidth="md" className='mt-3'>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, width: '100%' }}
                onSelectEvent={event => {
                    navigate(`/appointments/${event.id}`);
                }}
                onSelectSlot={handleSelectSlot}
                selectable={true}
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