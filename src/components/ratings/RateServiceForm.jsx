import React, { useState, useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { createRating } from '../../api/ratings.api';
import { Rating, Box, TextField, Button, Typography, Divider } from '@mui/material';

export const RateServiceForm = ({ serviceId }) => {
    const { user } = useContext(AuthContext);
    const [rating, setRating] = useState(0);
    const [opinion, setOpinion] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ratingData = {
            client: user.user.id,
            service: serviceId,
            rate: parseInt(rating, 10),
            opinion,
            date: new Date().toISOString(),
        };

        try {
            await createRating(ratingData);
        } catch (error) {
            console.error("Error creating rating: ", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" component="h2" align="center">
                Rate Service
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
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
                    Save
                </Button>
            </Box>
        </Box>
    );
}