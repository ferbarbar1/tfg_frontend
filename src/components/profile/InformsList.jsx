import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, Grid, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getAppointmentsByClient } from '../../api/appointments.api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';

export const InformsList = ({ user }) => {
    const [informs, setInforms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const informsPerPage = 3;
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('date');

    useEffect(() => {
        async function fetchAppointments() {
            try {
                const response = await getAppointmentsByClient(user.id);
                const extractedInforms = response.data
                    .filter(appointment => appointment.inform)
                    .map(appointment => ({
                        ...appointment.inform,
                        appointment_id: appointment.id,
                        appointment_date: appointment.schedule.date,
                        client: appointment.client.user.username,
                        worker: appointment.worker.user.username,
                        service: appointment.service.name
                    }));
                setInforms(extractedInforms);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        }
        fetchAppointments();
    }, [user]);

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const sortedInforms = [...informs].sort((a, b) => {
        if (sortCriteria === 'date') {
            return new Date(b.appointment_date) - new Date(a.appointment_date);
        } else if (sortCriteria === 'service') {
            return a.service.localeCompare(b.service);
        } else if (sortCriteria === 'worker') {
            return a.worker.localeCompare(b.worker);
        }
        return 0;
    });

    const filteredInforms = sortedInforms.filter(inform => {
        const informDate = new Date(inform.appointment_date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
            return informDate >= start && informDate <= end;
        } else if (start) {
            return informDate >= start;
        } else if (end) {
            return informDate <= end;
        } else {
            return true;
        }
    });

    const indexOfLastHistory = currentPage * informsPerPage;
    const indexOfFirstHistory = indexOfLastHistory - informsPerPage;
    const currentInforms = filteredInforms.slice(indexOfFirstHistory, indexOfFirstHistory + informsPerPage);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredInforms.length / informsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    if (!user) {
        return <Typography variant="h4">Please, log in to see your profile.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <FormControl sx={{ mr: 2 }}>
                    <InputLabel id="sort-label">Order by</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortCriteria}
                        onChange={handleSortChange}
                        label="Ordenar por"
                    >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="service">Service</MenuItem>
                        <MenuItem value="worker">Worker</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <IconButton color="default" onClick={handleClearFilters}>
                    <ClearIcon />
                </IconButton>
            </Box>
            {currentInforms.length > 0 ? (
                currentInforms.map((inform, index) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '600px'
                        }}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                                >
                                    Inform {index + 1}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    title={inform.service}
                                >
                                    {inform.service}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    title={inform.client}
                                >
                                    Patient: {inform.client}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    title={inform.worker}
                                >
                                    Attended by: {inform.worker}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    title={inform.appointment_date}
                                    sx={{ mt: 1, color: '#777' }}
                                >
                                    {inform.appointment_date}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} container justifyContent="flex-end">
                                <IconButton
                                    color="primary"
                                    aria-label="view report"
                                    onClick={() => navigate(`/appointments/${inform.appointment_id}/inform`)}
                                >
                                    <PictureAsPdfIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    No informs yet.
                </Typography>
            )}

            {filteredInforms.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredInforms.length / informsPerPage)}>
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
};