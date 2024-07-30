import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointment } from '../../api/appointments.api';
import { Box, Grid, Paper, Typography, Divider, Button } from '@mui/material';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function InformTemplate() {
    const { id: appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInform = async () => {
            try {
                const response = await getAppointment(appointmentId);
                setAppointment(response.data);
            } catch (error) {
                console.error('Error fetching inform:', error);
            }
        };
        fetchInform();
    }, [appointmentId]);

    if (!appointment) {
        return <div>Loading...</div>;
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    const calculateAge = (dateOfBirth) => {
        const birthDate = moment(dateOfBirth);
        const today = moment();
        return today.diff(birthDate, 'year');
    };

    const age = calculateAge(appointment.client.user.date_of_birth);

    const handleDownloadPdf = () => {
        const input = document.getElementById('informContent');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add multiple pages if the content is taller than the page height
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`inform-${appointmentId}.pdf`);
        }).catch(error => {
            console.error('Error generating PDF:', error);
        });
    };

    return (
        <>
            <Box sx={{ flexGrow: 1, padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div id="informContent" style={{ width: '210mm', minHeight: '297mm', padding: '10mm' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">Datos del paciente</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography variant="body1"><strong>Nombre:</strong> {appointment.client.user.first_name} {appointment.client.user.last_name}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body1"><strong>Edad:</strong> {age} años</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">Información médica relevante</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Typography variant="body1">{appointment.inform?.relevant_information || 'No disponible'}</Typography>
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
                                <Typography variant="body1">{appointment.schedule.date} {appointment.schedule.time}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">Diagnóstico</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Typography variant="body1"> {appointment.inform?.diagnostic || 'No disponible'} </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">Tratamiento</Typography>
                                <Divider sx={{ marginY: 2 }} />
                                <Typography variant="body1"> {appointment.inform?.treatment || 'No disponible'} </Typography>
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
                </div>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                <Button variant="contained" color="secondary" sx={{ marginRight: 2 }} onClick={handleDownloadPdf}>
                    Download PDF
                </Button>
                <Button variant="contained" color="error" onClick={handleBackClick}>Back</Button>
            </Box>
        </>
    );
}
