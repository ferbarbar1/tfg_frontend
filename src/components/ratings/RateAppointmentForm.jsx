import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { createRating, getRatingByAppointment, updateRating } from '../../api/ratings.api';
import { Rating, Box, TextField, Button, Typography, Divider, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const RateAppointmentForm = ({ appointmentId, closeModal }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [rate, setRate] = useState(0);
    const [opinion, setOpinion] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [ratingId, setRatingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const existingRating = await getRatingByAppointment(appointmentId);
                if (existingRating.data.length > 0) {
                    setRatingId(existingRating.data[0].id);
                    setRate(existingRating.data[0].rate || 0);
                    setOpinion(existingRating.data[0].opinion || "");
                    setIsUpdate(true);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching rating: ", error);
                setIsLoading(false);
            }
        };

        fetchRating();
    }, [user.id, appointmentId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ratingData = {
            client_id: user.id,
            appointment_id: appointmentId,
            rate: parseInt(rate, 10),
            opinion,
        };

        try {
            if (isUpdate) {
                await updateRating(ratingId, ratingData);
            } else {
                await createRating(ratingData);
            }
            closeModal();
        } catch (error) {
            console.error("Error creating/updating rating: ", error.response?.data || error.message);
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" component="h2" align="center">
                {isUpdate ? t('update_button') : t('add_button')}
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            {isUpdate && (
                <Alert severity="warning" className="mb-3">
                    {t('update_rating_info')}
                </Alert>
            )}
            <Alert severity="info" className="mb-3">
                {t('anonymous_rating_info')}
            </Alert>
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>{t('rate_label')}:</Typography>
                <Rating
                    name="rate"
                    value={rate}
                    onChange={(event, newValue) => {
                        setRate(newValue);
                    }}
                />
            </Box>
            <TextField
                margin="normal"
                required
                fullWidth
                id="opinion"
                label={t('opinion_label')}
                name="opinion"
                multiline
                rows={4}
                value={opinion}
                onChange={(event) => setOpinion(event.target.value)}
            />
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    {isUpdate ? t('update_button') : t('save_button')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={closeModal}
                    sx={{ ml: 2 }}
                >
                    {t('cancel_button')}
                </Button>
            </Box>
        </Box>
    );
};