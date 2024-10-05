import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Grid, Paper, Divider } from '@mui/material';
import { getAllRatings } from '../../api/ratings.api';
import { getAllInvoices } from '../../api/invoices.api';
import { getAllAppointments } from '../../api/appointments.api';
import { getAllClients } from '../../api/clients.api';
import { getAllServices } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';
import { useTranslation } from 'react-i18next';

export function Summary() {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        async function fetchData() {
            try {
                const ratingsResponse = await getAllRatings();
                const invoicesResponse = await getAllInvoices();
                const appointmentsResponse = await getAllAppointments();
                const clientsResponse = await getAllClients();
                const servicesResponse = await getAllServices();
                const workersResponse = await getAllWorkers();
                setRatings(ratingsResponse.data);
                setInvoices(invoicesResponse.data);
                setAppointments(appointmentsResponse.data);
                setClients(clientsResponse.data);
                setServices(servicesResponse.data);
                setWorkers(workersResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const filteredRatings = ratings.filter(rating => {
        const ratingDate = new Date(rating.date);
        return ratingDate.getMonth() + 1 === selectedMonth && ratingDate.getFullYear() === selectedYear;
    });

    const filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate.getMonth() + 1 === selectedMonth && invoiceDate.getFullYear() === selectedYear;
    });

    const filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.schedule.date);
        return appointmentDate.getMonth() + 1 === selectedMonth && appointmentDate.getFullYear() === selectedYear;
    });

    const filteredClients = clients.filter(client => {
        const clientJoinDate = new Date(client.user.date_joined);
        return clientJoinDate.getMonth() + 1 === selectedMonth && clientJoinDate.getFullYear() === selectedYear;
    });

    const filteredWorkers = workers.filter(worker => {
        const workerJoinDate = new Date(worker.user.date_joined);
        return workerJoinDate.getMonth() + 1 === selectedMonth && workerJoinDate.getFullYear() === selectedYear;
    });

    const totalRatings = filteredRatings.length;
    const averageRating = totalRatings ? (filteredRatings.reduce((acc, rating) => acc + rating.rate, 0) / totalRatings).toFixed(2) : 0;
    const totalAmount = filteredInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const totalAppointments = filteredAppointments.length;
    const totalClients = filteredClients.length;
    const totalServices = services.length;
    const totalWorkers = filteredWorkers.length;

    return (
        <Box sx={{ width: '100%', height: 'auto', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }} gutterBottom>
                {t('clinic_statistics_summary')}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', mb: 4 }}>
                <FormControl sx={{ mr: 2, width: 200 }}>
                    <InputLabel>{t('month')}</InputLabel>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label={t('month')}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <MenuItem key={month} value={month}>
                                {new Date(0, month - 1).toLocaleString('es-ES', { month: 'long' })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ width: 200 }}>
                    <InputLabel>{t('year')}</InputLabel>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        label={t('year')}
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_appointments')}</Typography>
                            <Typography variant="h4">{totalAppointments}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_amount')}</Typography>
                            <Typography variant="h4">{totalAmount.toFixed(2)} €</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_ratings')}</Typography>
                            <Typography variant="h4">{totalRatings}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('average_rating')}</Typography>
                            <Typography variant="h4">{averageRating}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_clients')}</Typography>
                            <Typography variant="h4">{totalClients}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_services')}</Typography>
                            <Typography variant="h4">{totalServices}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{t('total_workers')}</Typography>
                            <Typography variant="h4">{totalWorkers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}