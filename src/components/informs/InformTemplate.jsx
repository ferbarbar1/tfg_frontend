import React, { useEffect, useState } from 'react';
import { getAppointment } from '../../api/appointments.api';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';

export function InformTemplate({ appointmentId }) {
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const fetchInform = async () => {
            try {
                const response = await getAppointment(appointmentId);
                const responseData = response.data;
                setAppointment({
                    worker: responseData.worker,
                    client: responseData.client,
                    schedule: responseData.schedule,
                    inform: responseData.inform,
                });
            } catch (error) {
                console.error('Error fetching inform:', error);
            }
        };
        fetchInform();
    }, [appointmentId]);

    if (!appointment) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Datos del paciente</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1"><strong>Nombre:</strong> {appointment.client.user.first_name} {appointment.client.user.last_name}</Typography>
                        <Typography variant="body1"><strong>Edad:</strong> {appointment.client.user.date_of_birth}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Historial médico relevante</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">{appointment.inform.medicalHistory}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Motivo de la consulta</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">{appointment.description}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Modalidad</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">{appointment.modality}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Atendido por:</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">{appointment.worker.user.first_name} {appointment.worker.user.last_name}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Fecha</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">{appointment.schedule.date}: {appointment.schedule.time}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Diagnóstico</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1"> {appointment.inform.diagnostic} </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Tratamiento</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1"> {appointment.inform.treatment} </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6">Firma de la clínica</Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="body1">Firma</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
