import React from 'react';
import { Typography, Box, Grid, Divider, Button, Rating } from '@mui/material';

export const RatingsServiceList = ({ ratings, closeModal }) => (
    <Box>
        <Typography variant="h3" align="center" gutterBottom>Ratings</Typography>
        <Divider sx={{ marginBottom: 2, bgcolor: 'grey' }} />
        {ratings.length > 0 ? (
            ratings.map((rating, index) => (
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
            <Typography variant="body1" align="center" style={{ color: 'grey' }}>No ratings yet.</Typography>
        )}
        <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="error" onClick={closeModal}>Close</Button>
        </Box>
    </Box>
);