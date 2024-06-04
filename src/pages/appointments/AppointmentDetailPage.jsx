import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment, deleteAppointment, updateAppointment } from '../../api/appointments.api';
import { Button, TextField, Box, Card, CardContent, Grid } from '@mui/material';

export function AppointmentDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [worker, setWorker] = useState('');
    const [schedule, setSchedule] = useState({ date: '', time: '' });
    const [modality, setModality] = useState('');
    const [meeting_link, setMeetingLink] = useState('');

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
                setSchedule({ date: appointmentData.schedule.date, time: `${appointmentData.schedule.start_time} - ${appointmentData.schedule.end_time}` });
                setModality(appointmentData.modality);
                setMeetingLink(appointmentData.meeting_link);
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
            const [start_time, end_time] = schedule.time.split(' - ');
            const updatedAppointment = {
                description,
                status,
                client,
                worker,
                schedule: { date: schedule.date, start_time, end_time },
                modality,
                meeting_link,
            };

            await updateAppointment(id, updatedAppointment);
            navigate('/appointments/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={3}>
                        <TextField label="Client" value={client.user.username} onChange={e => setClient(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Worker" value={worker.user.username} onChange={e => setWorker(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Reason" value={description} onChange={e => setDescription(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Status" value={status} onChange={e => setStatus(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Date" value={schedule.date} onChange={e => setSchedule(prev => ({ ...prev, date: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Time" value={schedule.time} onChange={e => setSchedule(prev => ({ ...prev, time: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Modality" value={modality} onChange={e => setModality(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField label="Meeting Link" value={meeting_link} onChange={e => setMeetingLink(e.target.value)} />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
                </Box>
            </CardContent>
        </Card>
    );
}