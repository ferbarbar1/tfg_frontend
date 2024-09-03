import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../../api/services.api';
import { getRatingByAppointment } from '../../api/ratings.api';
import { getAppointmentsByService } from '../../api/appointments.api';
import { OffersContext } from '../../contexts/OffersContext';
import { Container, Grid, Card, CardContent, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Divider, Rating, IconButton, Tooltip, Modal } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BookIcon from '@mui/icons-material/Book';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import { AppointmentForm } from '../appointments/AppointmentForm';

export function ServiceDetail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [service, setService] = useState({});
    const [workers, setWorkers] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { id } = useParams();
    const { activeOffer } = useContext(OffersContext);

    useEffect(() => {
        async function fetchService() {
            try {
                const serviceResponse = await getService(id);
                const serviceData = serviceResponse.data;
                setService(serviceData);
                setWorkers(serviceData.workers);

                if (activeOffer && activeOffer.services.includes(Number(id))) {
                    const discount = activeOffer.discount / 100;
                    const discountedPrice = (serviceData.price * (1 - discount)).toFixed(2);
                    setService(prevService => ({ ...prevService, discountedPrice }));
                }

                const appointmentsResponse = await getAppointmentsByService(id);
                const ratingsArray = [];
                for (let appointment of appointmentsResponse.data) {
                    const ratingsResponse = await getRatingByAppointment(appointment.id);
                    ratingsArray.push(...ratingsResponse.data);
                }
                setRatings(ratingsArray);
                if (ratingsArray.length > 0) {
                    const average = ratingsArray.reduce((acc, rating) => acc + Number(rating.rate), 0) / ratingsArray.length;
                    setAvgRating(average);
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
        return <div>{t('loading')}</div>;
    }

    const getShortDescription = (text) => {
        const maxLength = 100;
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <Container className="mt-5">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" align="center" gutterBottom>{service.name}</Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4} container justifyContent="center" alignItems="center" sx={{ ml: 2 }}>
                                    <img src={service.image} alt={service.name} style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
                                    {service.discountedPrice ? (
                                        <Box textAlign="center" sx={{ ml: 2 }}>
                                            <Typography variant="h6" style={{ textDecoration: 'line-through', color: 'red' }}>
                                                {t('original_price')}: {service.price} €/hour
                                            </Typography>
                                            <Typography variant="h5" style={{ color: 'green' }}>
                                                <LocalOfferIcon /> {t('discounted_price')}: {service.discountedPrice} €/hour
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="h5" align="center" sx={{ ml: 2 }}>
                                            {t('price_label')}: {service.price} €/hour
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="body1" align="center" paragraph sx={{ mt: 3, ml: 4, mr: 2 }}>
                                        {showFullDescription ? service.description : getShortDescription(service.description)}
                                    </Typography>
                                    {service.description.length > 100 && (
                                        <Box display="flex" justifyContent="center" mb={2}>
                                            <Button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                endIcon={showFullDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            >
                                                {showFullDescription ? t('show_less') : t('show_more')}
                                            </Button>
                                        </Box>
                                    )}
                                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                        <Rating
                                            value={avgRating}
                                            precision={0.5}
                                            readOnly
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />
                                        {ratings.length > 0 ? (
                                            <Tooltip title={t('show_ratings')} placement="top">
                                                <IconButton onClick={() => navigate(`/services/${id}/ratings`)} style={{ marginLeft: '10px' }}>
                                                    <Typography variant="body1" sx={{ color: 'blue' }}>{avgRating.toFixed(1)}/5</Typography>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="body1" style={{ marginLeft: '10px', color: 'grey' }}>{t('no_ratings_yet')}</Typography>
                                        )}
                                    </Box>
                                    <Typography variant="body1" align="center" paragraph>{t('specialists_working')}</Typography>
                                    <Box display="flex" justifyContent="center">
                                        <List>
                                            {workers.map((worker, index) => (
                                                <ListItem key={index}>
                                                    <ListItemAvatar>
                                                        <Avatar src={worker.user.image} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${worker.user.first_name} ${worker.user.last_name}`} secondary={`${t('experience')}: ${worker.experience} ${t('years')}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box mt={3} display="flex" justifyContent="center">
                                <Button variant="contained" color="primary" onClick={() => setAppointmentModalOpen(true)} startIcon={<BookIcon />}>
                                    {t('book')}
                                </Button>
                                <Modal
                                    open={appointmentModalOpen}
                                    onClose={() => setAppointmentModalOpen(false)}
                                >
                                    <Box sx={{ width: '100%', maxWidth: '400px', p: 2, bgcolor: 'background.paper', margin: 'auto', mt: 4, borderRadius: 1 }}>
                                        <AppointmentForm closeModal={() => setAppointmentModalOpen(false)} serviceId={id} />
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