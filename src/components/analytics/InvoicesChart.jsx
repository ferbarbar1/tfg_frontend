import React, { useState, useEffect } from 'react';
import { getAllInvoices } from '../../api/invoices.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function InvoicesChart() {
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2024');
    const [years, setYears] = useState([]);

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const response = await getAllInvoices();
                const data = response.data;

                const uniqueYears = [...new Set(data.map(invoice => new Date(invoice.date).getFullYear()))];
                setYears(uniqueYears);

                const filteredData = data.filter(invoice => new Date(invoice.date).getFullYear().toString() === selectedYear);
                setInvoices(filteredData);

            } catch (error) {
                console.error(error);
            }
        }
        fetchInvoices();
    }, [selectedYear]);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const monthlyData = invoices.reduce((acc, invoice) => {
        const month = new Date(invoice.date).toLocaleString('es-ES', { month: 'short' });
        if (!acc[month]) {
            acc[month] = { month, amount: 0 };
        }
        acc[month].amount += invoice.amount;
        return acc;
    }, {});

    const monthlyArray = Object.values(monthlyData);

    return (
        <Box sx={{ width: '100%', height: 600 }}>
            <Typography variant="h6" gutterBottom>
                {t('clinic_billing')}
            </Typography>

            <FormControl sx={{ mb: 2, width: 200 }}>
                <InputLabel>{t('year')}</InputLabel>
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    label={t('year')}
                >
                    {years.map(year => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <ResponsiveContainer width="100%" height="50%">
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
            <ResponsiveContainer width="100%" height="40%">
                <LineChart data={monthlyArray} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}