import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Grid, Button, Rating, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const RatingsServiceList = ({ ratings }) => {
    const { t } = useTranslation();
    const [starFilter, setStarFilter] = useState('');
    const navigate = useNavigate();

    const handleFilterChange = (event) => {
        setStarFilter(event.target.value);
    };

    const filteredRatings = ratings.filter(rating => {
        if (starFilter === '') return true;
        return rating.rate === starFilter;
    });

    const sortedRatings = filteredRatings.sort((a, b) => b.rate - a.rate);

    return (
        <Box>
            <FormControl sx={{ mb: 2, width: '200px' }}>
                <InputLabel>{t('filter_by_stars')}</InputLabel>
                <Select
                    value={starFilter}
                    onChange={handleFilterChange}
                    label={t('filter_by_stars')}
                >
                    <MenuItem value="">{t('all_stars')}</MenuItem>
                    {[5, 4, 3, 2, 1].map(star => (
                        <MenuItem key={star} value={star}>{star} {t('stars')}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {sortedRatings.length > 0 ? (
                sortedRatings.map((rating, index) => (
                    <Box key={index} mt={3} mb={3} p={2} bgcolor="grey.100" borderRadius="borderRadius">
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body1"><strong>{rating.client.user.username}</strong>: {rating.opinion}</Typography>
                            </Grid>
                        </Grid>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Box ml={1}>
                                <Rating value={rating.rate} readOnly precision={0.5} />
                            </Box>
                            <Typography variant="body1" ml={1}>{rating.rate}/5</Typography>
                        </Box>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{ color: 'grey' }} mt={1} align="right">{new Date(rating.date).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ))
            ) : (
                <Typography variant="body1" align="center" style={{ color: 'grey' }}>{t('no_ratings_yet')}</Typography>
            )}
            <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>{t('back')}</Button>
            </Box>
        </Box>
    );
};