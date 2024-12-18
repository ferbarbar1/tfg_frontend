import React, { useState, useEffect } from 'react';
import { getAllRatings } from '../../api/ratings.api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Rating, Grid, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function WorkersRatingsChart() {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [workerRatings, setWorkerRatings] = useState({});
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        async function fetchRatings() {
            try {
                const response = await getAllRatings();
                setRatings(response.data);
                const ratingsByWorker = response.data.reduce((acc, rating) => {
                    const workerName = rating.appointment?.worker?.user?.username || t('unknown');
                    const ratingValue = rating.rate;
                    const ratingDate = new Date(rating.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

                    if (!acc[workerName]) {
                        acc[workerName] = { total: 0, count: 0, trends: {}, ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
                    }

                    acc[workerName].total += rating.rate;
                    acc[workerName].count += 1;
                    acc[workerName].ratingCounts[ratingValue] += 1;

                    if (!acc[workerName].trends[ratingDate]) {
                        acc[workerName].trends[ratingDate] = { date: ratingDate, count: 0, total: 0 };
                    }
                    acc[workerName].trends[ratingDate].total += rating.rate;
                    acc[workerName].trends[ratingDate].count += 1;

                    return acc;
                }, {});
                setWorkerRatings(ratingsByWorker);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRatings();
    }, [t]);

    useEffect(() => {
        if (selectedWorker && workerRatings[selectedWorker]) {
            const trendsArray = Object.values(workerRatings[selectedWorker].trends).map(trend => ({
                ...trend,
                averageRating: (trend.total / trend.count).toFixed(2),
            }));
            setTrendData(trendsArray);
        }
    }, [selectedWorker, workerRatings]);

    const handleWorkerChange = (event) => {
        setSelectedWorker(event.target.value);
    };

    const ratingCounts = selectedWorker ? workerRatings[selectedWorker]?.ratingCounts : {};

    const averageRating = selectedWorker
        ? (workerRatings[selectedWorker].total / workerRatings[selectedWorker].count).toFixed(2)
        : 0;

    return (
        <Box sx={{ width: '100%', height: 800 }}>
            <FormControl sx={{ mb: 2, width: 200 }}>
                <InputLabel>{t('worker_label')}</InputLabel>
                <Select
                    value={selectedWorker}
                    onChange={handleWorkerChange}
                    label={t('worker_label')}
                >
                    {Object.keys(workerRatings).map(worker => (
                        <MenuItem key={worker} value={worker}>
                            {worker}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!selectedWorker ? (
                <Alert severity="info">{t('select_worker_to_view_data')}</Alert>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6">{t('ratings_summary')}</Typography>
                            <Typography variant="body1">{t('total_ratings')}: {workerRatings[selectedWorker]?.count}</Typography>

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
                        {trendData.length > 0 ? (
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
                        ) : (
                            <Alert severity="info">{t('no_ratings_available')}</Alert>
                        )}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}