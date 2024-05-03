import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createAppointment } from '../../api/appointments.api';

export const AppointmentForm = ({ closeModal }) => {
    const [description, setDescription] = useState("");
    const [client, setClient] = useState("");
    const [worker, setWorker] = useState("");
    const [schedule, setSchedule] = useState({ date: '', start_time: '', end_time: '' });
    const [modality, setModality] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const appointmentData = {
                schedule: {
                    date: schedule.date,
                    start_time: schedule.start_time,
                    end_time: schedule.end_time,
                    worker,
                },
                description,
                client,
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

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Desciption"
                className="input-field"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Client"
                className="input-field"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
            />
            <input
                type="text"
                placeholder="Worker"
                className="input-field"
                required
                value={worker}
                onChange={(e) => setWorker(e.target.value)}
            />
            <input
                type="date"
                placeholder="Date"
                className="input-field"
                required
                value={schedule.date}
                onChange={(e) => setSchedule(prev => ({ ...prev, date: e.target.value }))} />
            <input
                type="time"
                placeholder="Start Time"
                className="input-field"
                required
                value={schedule.start_time}
                onChange={(e) => setSchedule(prev => ({ ...prev, start_time: e.target.value }))} />

            <input
                type="time"
                placeholder="End Time"
                className="input-field"
                required
                value={schedule.end_time}
                onChange={(e) => setSchedule(prev => ({ ...prev, end_time: e.target.value }))} />

            <input
                type="text"
                placeholder="Modality"
                className="input-field"
                required
                value={modality}
                onChange={(e) => setModality(e.target.value)} />
            <div className="modalFooter">
                <button type="submit" className="button register-button">Create</button>
                <button type="button" className="button close-button" onClick={closeModal}>Cancel</button>
            </div>
        </form>
    );
};