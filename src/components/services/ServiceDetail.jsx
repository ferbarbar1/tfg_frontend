import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getService } from '../../api/services.api';
import { getRatingByAppointment } from '../../api/ratings.api';
import { getAppointmentsByService } from '../../api/appointments.api';
import { OffersContext } from '../../contexts/OffersContext';
import { Container, Grid, Card, CardContent, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Divider, Rating } from '@mui/material';
import Modal from '@mui/material/Modal';
import { AppointmentForm } from '../appointments/AppointmentForm';
import { RatingsServiceList } from '../ratings/RatingsServiceList';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export function ServiceDetail() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [image, setImage] = useState('');
    const [workers, setWorkers] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [ratingsModalOpen, setRatingsModalOpen] = useState(false);
    const { id } = useParams();

    const { activeOffer } = useContext(OffersContext);

    useEffect(() => {
        async function fetchService() {
            try {
                const serviceResponse = await getService(id);
                const service = serviceResponse.data;
                setName(service.name);
                setDescription(service.description);
                setImage(service.image);
                setPrice(service.price);
                setWorkers(service.workers);

                // Verificar si la oferta activa aplica a este servicio
                if (activeOffer && activeOffer.services.includes(Number(id))) {
                    const discount = activeOffer.discount / 100;
                    const newPrice = (service.price * (1 - discount)).toFixed(2);
                    setDiscountedPrice(newPrice);
                }

                const appointmentsResponse = await getAppointmentsByService(id);
                const ratings = [];
                for (let appointment of appointmentsResponse.data) {
                    const ratingsResponse = await getRatingByAppointment(appointment.id);
                    ratings.push(...ratingsResponse.data);
                }
                setRatings(ratings);
                if (ratings.length > 0) {
                    const avgRating = ratings.reduce((acc, rating) => acc + Number(rating.rate), 0) / ratings.length;
                    setAvgRating(avgRating);
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchService();
    }, [id, activeOffer]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" align="center" gutterBottom>{name}</Typography>
                            <Divider sx={{ marginBottom: 2, bgcolor: 'grey' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4} container justifyContent="center" alignItems="center" direction="column">
                                    <img src={image} alt={name} style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
                                    {discountedPrice ? (
                                        <>
                                            <Typography variant="h6" align="center" style={{ textDecoration: 'line-through', color: 'red' }}>
                                                Original Price: {price} €/hour
                                            </Typography>
                                            <Typography variant="h6" align="center" style={{ color: 'green' }}>
                                                Discounted Price: {discountedPrice} €/hour
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="h6" align="center">Price: {price} €/hour</Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="body1" align="center" paragraph>{description}</Typography>
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                        <Rating
                                            value={avgRating}
                                            precision={0.5}
                                            readOnly
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />
                                        {ratings.length > 0 ? (
                                            <Button onClick={() => setRatingsModalOpen(true)} style={{ marginLeft: '10px' }}>
                                                <Typography variant="body1">{avgRating.toFixed(1)}/5</Typography>
                                            </Button>
                                        ) : (
                                            <Typography variant="body1" style={{ marginLeft: '10px', color: 'grey' }}>No ratings yet</Typography>
                                        )}
                                    </Box>
                                    <Typography variant="body1" align="center" paragraph>Specialists working on this service:</Typography>
                                    <Box display="flex" justifyContent="center">
                                        <List>
                                            {workers.map((worker, index) => (
                                                <ListItem key={index}>
                                                    <ListItemAvatar>
                                                        <Avatar src={worker.user.image} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${worker.user.first_name} ${worker.user.last_name}`} secondary={`Experience: ${worker.experience} years`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box mt={2} display="flex" justifyContent="center">
                                <Box ml={2}>
                                    <Button variant="contained" color="primary" onClick={() => setAppointmentModalOpen(true)}>Book</Button>
                                </Box>
                                <Modal
                                    open={appointmentModalOpen}
                                    onClose={() => setAppointmentModalOpen(false)}
                                >
                                    <Box sx={{ width: '100%', maxWidth: '400px', p: 2, bgcolor: 'background.paper', margin: 'auto', mt: 2 }}>
                                        <AppointmentForm closeModal={() => setAppointmentModalOpen(false)} serviceId={id} />
                                    </Box>
                                </Modal>
                                <Modal
                                    open={ratingsModalOpen}
                                    onClose={() => setRatingsModalOpen(false)}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        maxWidth: '500px',
                                        height: '500px',
                                        overflowY: 'auto',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        margin: 'auto',
                                        mt: 2
                                    }}>
                                        <RatingsServiceList ratings={ratings} closeModal={() => setRatingsModalOpen(false)} />
                                    </Box>
                                </Modal>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
