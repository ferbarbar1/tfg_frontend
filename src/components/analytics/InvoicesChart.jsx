import React, { useState, useEffect } from 'react';
import { getAllInvoices } from '../../api/invoices.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Paper, Divider, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function InvoicesChart() {
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [years, setYears] = useState([]);
    const [months] = useState([
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]);

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const response = await getAllInvoices();
                const data = response.data;

                // Convertir los años a cadenas de texto
                const uniqueYears = [...new Set(data.map(invoice => new Date(invoice.created_at).getFullYear().toString()))];
                setYears(uniqueYears);

                setInvoices(data);

            } catch (error) {
                console.error(error);
            }
        }
        fetchInvoices();
    }, []);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.created_at);
        const invoiceYear = invoiceDate.getFullYear().toString();
        const invoiceMonth = invoiceDate.toLocaleString('es-ES', { month: 'long' });
        return (selectedYear === '' || invoiceYear === selectedYear) && (selectedMonth === '' || invoiceMonth === selectedMonth);
    });

    const monthlyData = filteredInvoices.reduce((acc, invoice) => {
        const month = new Date(invoice.created_at).toLocaleString('es-ES', { month: 'short' });
        if (!acc[month]) {
            acc[month] = { month, amount: 0 };
        }
        acc[month].amount += invoice.amount;
        return acc;
    }, {});

    const monthlyArray = Object.values(monthlyData);

    const totalAnnualBilling = filteredInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const averageMonthlyBilling = (totalAnnualBilling / 12).toFixed(2);

    return (
        <Box sx={{ width: '100%', height: 'auto', p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }} gutterBottom>
                {t('clinic_billing')}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl sx={{ mb: 2, width: '100%' }}>
                        <InputLabel>{t('year')}</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={handleYearChange}
                            label={t('year')}
                        >
                            <MenuItem value="">{t('all_years')}</MenuItem>
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl sx={{ mb: 2, width: '100%' }}>
                        <InputLabel>{t('month')}</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            label={t('month')}
                        >
                            <MenuItem value="">{t('all_months')}</MenuItem>
                            {months.map((month, index) => (
                                <MenuItem key={index} value={month}>
                                    {month}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {filteredInvoices.length === 0 ? (
                <Alert severity="info">{t('no_data_available')}</Alert>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">{t('total_annual_billing')}</Typography>
                                <Typography variant="h4">{totalAnnualBilling.toFixed(2)} €</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">{t('average_monthly_billing')}</Typography>
                                <Typography variant="h4">{averageMonthlyBilling} €</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 4 }}>{t('monthly_billing')}</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlyArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>

                    <Typography variant="h6" sx={{ mt: 4 }}>{t('annual_billing_trend')}</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </>
            )}
        </Box>
    );
}