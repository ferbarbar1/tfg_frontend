import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createAppointment, createCheckoutSession } from '../../api/appointments.api';
import { getSchedulesAvailablesByDate } from '../../api/schedules.api';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Form } from "react-bootstrap";
import { AuthContext } from '../../contexts/AuthContext';

const stripePromise = loadStripe('pk_test_51PFdYTGzZooPGUyPyarTnl6RMGFS0Zkll6iKQcpYRK0sICx2lokA4BEXIoxm1j4n1OmvkOP48mYaTaGBpsPfzs5Y0012QYjWvu');

export const AppointmentForm = ({ closeModal, serviceId }) => {
    const { user } = useContext(AuthContext);
    const [description, setDescription] = useState("");
    const [client, setClient] = useState("");
    const [worker, setWorker] = useState("");
    const [schedule, setSchedule] = useState({ id: null, date: '', start_time: '', end_time: '' });
    const [modality, setModality] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (schedule.date) {
            const loadAvailableTimes = async () => {
                try {
                    const response = await getSchedulesAvailablesByDate(schedule.date);
                    const times = response.data;
                    // Filtrar para mantener solo horarios únicos
                    const uniqueTimes = times.filter((time, index, self) =>
                        index === self.findIndex((t) => (
                            t.start_time === time.start_time && t.end_time === time.end_time
                        ))
                    );
                    setAvailableTimes(uniqueTimes);
                } catch (error) {
                    console.error("Error al cargar los horarios disponibles:", error);
                    setAvailableTimes([]);
                }
            };
            loadAvailableTimes();
        }
    }, [schedule.date]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const clientUser = user.user.role === 'client' ? user.id : client;
        try {
            const appointmentData = {
                schedule: {
                    date: schedule.date,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    worker,
                },
                description,
                client: clientUser,
                worker,
                modality,
            };

            await createAppointment(appointmentData);
            closeModal();
            navigate('/appointments/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleZoomAuth = () => {
        const clientId = 'd0NInwj3Q3SFiF09kf9c8w';
        const redirectUri = encodeURIComponent('http://127.0.0.1:8000/api/oauth/callback');
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
        window.location.href = zoomAuthUrl;
    };

    const handleBook = async () => {
        try {
            const stripe = await stripePromise;
            const clientId = user.user.role === 'client' ? user.id : client;
            const scheduleId = schedule.id;

            const sessionId = await createCheckoutSession(serviceId, clientId, scheduleId, description, modality);
            if (!sessionId) {
                console.error('No se recibió el ID de la sesión de Stripe.');
                return;
            }

            const result = await stripe.redirectToCheckout({
                sessionId,
            });

            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mt-2 mb-2">
                <Form.Control
                    type="text"
                    placeholder="Description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            {user.user.role === "owner" &&
                <>
                    <Form.Group className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Client"
                            required
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Worker"
                            required
                            value={worker}
                            onChange={(e) => setWorker(e.target.value)}
                        />
                    </Form.Group>
                </>
            }
            <Form.Group className="mb-2">
                <Form.Control
                    type="date"
                    required
                    value={schedule.date}
                    onChange={(e) => setSchedule(prev => ({ ...prev, date: e.target.value }))}
                />
            </Form.Group>
            {/* Campo para seleccionar el horario disponible */}
            {availableTimes.length > 0 && (
                <Form.Group className="mb-2">
                    <Form.Label>Available Schedules</Form.Label>
                    <Form.Select
                        required
                        value={schedule.start_time}
                        onChange={(e) => {
                            const selectedTime = availableTimes.find(time => time.start_time === e.target.value);
                            if (selectedTime) {
                                setSchedule(prev => ({
                                    ...prev,
                                    id: selectedTime.id,
                                    start_time: selectedTime.start_time,
                                    end_time: selectedTime.end_time
                                }));
                            }
                        }}
                    >
                        <option>Select a schedule</option>
                        {availableTimes.map((time, index) => (
                            <option key={index} value={time.start_time}>{time.start_time} - {time.end_time}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
            )}
            <Form.Group className="mb-2">
                <Form.Select
                    required
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                >
                    <option value="">Select Modality</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="IN_PERSON">In person</option>
                </Form.Select>
            </Form.Group>
            {modality === 'VIRTUAL' && (
                <Button variant="secondary" onClick={handleZoomAuth}>Authenticate with Zoom</Button>
            )}
            <div className="modalFooter">
                <Button variant="primary" onClick={handleBook}>Book</Button>
                <Button variant="danger" onClick={closeModal}>Cancel</Button>
            </div>
        </Form>
    );
};