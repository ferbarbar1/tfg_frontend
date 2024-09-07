import React, { useState, useContext, useEffect } from "react";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { createAppointment, createCheckoutSession } from '../../api/appointments.api';
import { getSchedulesAvailablesByDate } from '../../api/schedules.api';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { getAllClients } from '../../api/clients.api';
import { getAllWorkers } from '../../api/workers.api';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe('pk_test_51PFdYTGzZooPGUyPyarTnl6RMGFS0Zkll6iKQcpYRK0sICx2lokA4BEXIoxm1j4n1OmvkOP48mYaTaGBpsPfzs5Y0012QYjWvu');

export const AppointmentForm = ({ closeModal, serviceId, selectedSlot }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const { showAlert } = useAlert();
    const [description, setDescription] = useState("");
    const [client, setClient] = useState("");
    const [worker, setWorker] = useState("");
    const [schedule, setSchedule] = useState({
        id: null,
        date: selectedSlot ? moment(selectedSlot.start).format('YYYY-MM-DD') : '',
        start_time: '',
        end_time: ''
    });
    const [modality, setModality] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [clients, setClients] = useState([]);

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
                    console.error("Error loading available times", error);
                    setAvailableTimes([]);
                }
            };
            loadAvailableTimes();
        }
    }, [schedule.date, t]);

    useEffect(() => {
        const fetchWorkersAndClients = async () => {
            try {
                const workersResponse = await getAllWorkers();
                const clientsResponse = await getAllClients();
                setWorkers(workersResponse.data);
                setClients(clientsResponse.data);
            } catch (error) {
                console.error("Error loading workers and clients", error);
            }
        };
        fetchWorkersAndClients();
    }, [t]);

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
            showAlert(t('appointment_success'), 'success');
            navigate('/appointments/');
        } catch (error) {
            console.error("Error creating appointment", error);
            showAlert(t('appointment_error'), 'error');
        }
    };

    const handleBook = async () => {
        try {
            const stripe = await stripePromise;
            const clientId = user.user.role === 'client' ? user.id : client;
            const scheduleId = schedule.id;

            const sessionId = await createCheckoutSession(serviceId, clientId, scheduleId, description, modality);
            if (!sessionId) {
                console.error("Error creating checkout session");
                showAlert(t('checkout_session_error'), 'error');
                return;
            }

            const result = await stripe.redirectToCheckout({
                sessionId,
            });

            if (result.error) {
                showAlert(result.error.message, 'error');
            }
        } catch (error) {
            console.error("Error creating checkout session", error);
            showAlert(t('checkout_session_error'), 'error');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {user.user.role === "owner" &&
                <>
                    <FormControl fullWidth className="mb-2 mt-2">
                        <InputLabel id="client-label">{t('client_label')}</InputLabel>
                        <Select
                            labelId="client-label"
                            required
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            label={t('client_label')}
                        >
                            <MenuItem value="">
                                <em>{t('select_client')}</em>
                            </MenuItem>
                            {clients.map((client) => (
                                <MenuItem key={client.id} value={client.id}>{client.user.username}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth className="mb-2">
                        <InputLabel id="worker-label">{t('worker_label')}</InputLabel>
                        <Select
                            labelId="worker-label"
                            required
                            value={worker}
                            onChange={(e) => setWorker(e.target.value)}
                            label={t('worker_label')}
                        >
                            <MenuItem value="">
                                <em>{t('select_worker')}</em>
                            </MenuItem>
                            {workers.map((worker) => (
                                <MenuItem key={worker.id} value={worker.id}>{worker.user.username}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            }
            <FormControl fullWidth className="mt-2 mb-2">
                <TextField
                    label={t('reason_label')}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth className="mb-2">
                <TextField
                    type="date"
                    required
                    value={schedule.date}
                    onChange={(e) => setSchedule(prev => ({ ...prev, date: e.target.value }))}
                />
            </FormControl>
            {/* Campo para seleccionar el horario disponible */}
            {schedule.date && (availableTimes.length > 0 ? (
                <FormControl fullWidth className="mb-2">
                    <InputLabel id="schedule-label">{t('available_schedules_label')}</InputLabel>
                    <Select
                        labelId="schedule-label"
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
                        label={t('available_schedules_label')}
                    >
                        <MenuItem value="">
                            <em>{t('select_schedule')}</em>
                        </MenuItem>
                        {availableTimes.map((time, index) => (
                            <MenuItem key={index} value={time.start_time}>{time.start_time.split(':').slice(0, 2).join(':')} - {time.end_time.split(':').slice(0, 2).join(':')}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : <Alert severity="warning" className="mb-2">{t('no_schedules_available')}</Alert>
            )}
            <FormControl fullWidth className="mb-2">
                <InputLabel id="modality-label">{t('select_modality')}</InputLabel>
                <Select
                    labelId="modality-label"
                    required
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    label={t('select_modality')}
                >
                    <MenuItem value="">
                        <em>{t('select_modality')}</em>
                    </MenuItem>
                    <MenuItem value="VIRTUAL">{t('virtual')}</MenuItem>
                    <MenuItem value="IN_PERSON">{t('in_person')}</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleBook}>{t('book')}</Button>
                <Button variant="contained" color="error" onClick={closeModal} sx={{ ml: 2 }}>{t('cancel_button')}</Button>
            </Box>
        </Box>
    );
};