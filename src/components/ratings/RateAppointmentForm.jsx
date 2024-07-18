import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { createRating, getRatingByAppointment, updateRating } from '../../api/ratings.api';
import { Rating, Box, TextField, Button, Typography, Divider, CircularProgress, Alert } from '@mui/material';

export const RateAppointmentForm = ({ appointmentId, closeModal }) => {
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
            client: user.id,
            appointment: appointmentId,
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
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" component="h2" align="center">
                {isUpdate ? 'Update Rating' : 'Add Rating'}
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            {isUpdate && (
                <Alert severity="info" className="mb-3">
                    You have already rated this service. You can update your rating.
                </Alert>
            )}
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>Rate:</Typography>
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
                label="Opinion"
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
                    {isUpdate ? 'Update' : 'Save'}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={closeModal}
                    sx={{ ml: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};