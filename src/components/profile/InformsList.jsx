import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, Grid, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { getAppointmentsByClient } from '../../api/appointments.api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

export const InformsList = ({ user }) => {
    const { t } = useTranslation();
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
            {currentInforms.length > 0 ? (
                currentInforms.map((inform, index) => (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <FormControl sx={{ mr: 2 }}>
                                <InputLabel id="sort-label">{t('order_by')}</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    value={sortCriteria}
                                    onChange={handleSortChange}
                                    label={t('order_by')}
                                >
                                    <MenuItem value="date">{t('date')}</MenuItem>
                                    <MenuItem value="service">{t('service')}</MenuItem>
                                    <MenuItem value="worker">{t('worker')}</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label={t('start_date')}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={startDate || ''}
                                onChange={(e) => setStartDate(e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            <TextField
                                label={t('end_date')}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={endDate || ''}
                                onChange={(e) => setEndDate(e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            <Tooltip title={t('clear_button')}>
                                <IconButton color="default" onClick={handleClearFilters}>
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
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
                                        {t('inform')} {index + 1}
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
                                        {t('patient')}: {inform.client}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        title={inform.worker}
                                    >
                                        {t('attended_by')}: {inform.worker}
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
                                    <Tooltip title={t('view_report')}>
                                        <IconButton
                                            color="primary"
                                            aria-label={t('view_report')}
                                            onClick={() => navigate(`/appointments/${inform.appointment_id}/inform`)}
                                        >
                                            <PictureAsPdfIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Paper>
                    </>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    {t('no_informs')}
                </Typography>
            )}

            {filteredInforms.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        {t('previous')}
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredInforms.length / informsPerPage)}>
                        {t('next')}
                    </Button>
                </Box>
            )}
        </Box>
    );
};