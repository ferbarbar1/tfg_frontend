import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllAppointments } from '../../api/appointments.api';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { AppointmentForm } from '../../components/appointments/AppointmentForm';

const localizer = momentLocalizer(moment);

export function AppointmentsPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

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
        <div>
            <h1>Appointments</h1>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, width: 500 }}
                onSelectEvent={event => {
                    navigate(`/appointments/${event.id}`);
                }}
                onSelectSlot={handleSelectSlot}
                selectable={true}
            />
            <Modal
                isOpen={appointmentModalOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        zIndex: 1000,
                    },
                }}
                className="modalContent"
            >
                <div className="modalHeader">
                    <h2>Create Appointment</h2>
                </div>
                <div className="modalBody">
                    <AppointmentForm closeModal={closeModal} />
                </div>
            </Modal>
        </div>
    );
}