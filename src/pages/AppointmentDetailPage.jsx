import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, deleteAppointment, updateAppointment } from '../api/appointments.api';

export function AppointmentDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [worker, setWorker] = useState('');
    const [schedule, setSchedule] = useState({ date: '', start_time: '', end_time: '' });

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getAppointment(id);
                const appointmentData = response.data;
                setAppointment(appointmentData);
                setDescription(appointmentData.description);
                setStatus(appointmentData.status);
                setClient(appointmentData.client);
                setWorker(appointmentData.worker);
                setSchedule(appointmentData.schedule);
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
            const updatedAppointment = {
                description,
                status,
                client,
                worker,
                schedule
            };

            await updateAppointment(id, updatedAppointment);
            navigate('/appointments/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form>
                <label>
                    Description:
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                <label>
                    Status:
                    <input type="text" value={status} onChange={e => setStatus(e.target.value)} />
                </label>
                <label>
                    Client:
                    <input type="text" value={client} onChange={e => setClient(e.target.value)} />
                </label>
                <label>
                    Worker:
                    <input type="text" value={worker} onChange={e => setWorker(e.target.value)} />
                </label>
                <label>
                    Schedule:
                    <input type="text" value={schedule.date} onChange={e => setSchedule(prev => ({ ...prev, date: e.target.value }))} />
                    <input type="text" value={schedule.start_time} onChange={e => setSchedule(prev => ({ ...prev, start_time: e.target.value }))} />
                    <input type="text" value={schedule.end_time} onChange={e => setSchedule(prev => ({ ...prev, end_time: e.target.value }))} />
                </label>
            </form>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}