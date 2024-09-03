import React, { useState, useEffect } from 'react';
import { getAllRatings } from '../../api/ratings.api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Rating, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ServicesRatingsChart() {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [serviceRatings, setServiceRatings] = useState({});
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        async function fetchRatings() {
            try {
                const response = await getAllRatings();
                setRatings(response.data);
                const ratingsByService = response.data.reduce((acc, rating) => {
                    const serviceName = rating.appointment?.service?.name || t('unknown');
                    const ratingValue = rating.rate;
                    const ratingDate = new Date(rating.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

                    if (!acc[serviceName]) {
                        acc[serviceName] = { total: 0, count: 0, trends: {}, ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
                    }

                    acc[serviceName].total += rating.rate;
                    acc[serviceName].count += 1;
                    acc[serviceName].ratingCounts[ratingValue] += 1;

                    if (!acc[serviceName].trends[ratingDate]) {
                        acc[serviceName].trends[ratingDate] = { date: ratingDate, count: 0, total: 0 };
                    }
                    acc[serviceName].trends[ratingDate].total += rating.rate;
                    acc[serviceName].trends[ratingDate].count += 1;

                    return acc;
                }, {});
                setServiceRatings(ratingsByService);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRatings();
    }, [t]);

    useEffect(() => {
        if (selectedService && serviceRatings[selectedService]) {
            const trendsArray = Object.values(serviceRatings[selectedService].trends).map(trend => ({
                ...trend,
                averageRating: (trend.total / trend.count).toFixed(2),
            }));
            setTrendData(trendsArray);
        }
    }, [selectedService, serviceRatings]);

    const handleServiceChange = (event) => {
        setSelectedService(event.target.value);
    };

    const ratingCounts = selectedService ? serviceRatings[selectedService]?.ratingCounts : {};

    const averageRating = selectedService
        ? (serviceRatings[selectedService].total / serviceRatings[selectedService].count).toFixed(2)
        : 0;

    return (
        <Box sx={{ width: '100%', height: 800 }}>
            <FormControl sx={{ mb: 2, width: 200 }}>
                <InputLabel>{t('service_label')}</InputLabel>
                <Select
                    value={selectedService}
                    onChange={handleServiceChange}
                    label={t('service_label')}
                >
                    {Object.keys(serviceRatings).map(service => (
                        <MenuItem key={service} value={service}>
                            {service}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedService && (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6">{t('ratings_summary')}</Typography>
                            <Typography variant="body1">{t('total_ratings')}: {serviceRatings[selectedService]?.count}</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body1" sx={{ mr: 1 }}>{t('average_rating')}:</Typography>
                                <Rating name="average-rating" value={parseFloat(averageRating)} precision={0.1} readOnly />
                                <Typography sx={{ ml: 1 }}>({averageRating})</Typography>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating name="read-only" value={star} readOnly />
                                        <Typography sx={{ ml: 1 }}>{ratingCounts[star]} {t('ratings')}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Typography variant="h6">{t('ratings_trends')}</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Brush />
                                <Line type="monotone" dataKey="averageRating" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}