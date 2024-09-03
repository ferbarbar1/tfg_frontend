import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getService } from '../../api/services.api';
import { getRatingByAppointment } from '../../api/ratings.api';
import { getAppointmentsByService } from '../../api/appointments.api';
import { Container, Typography, Divider, CircularProgress } from '@mui/material';
import { RatingsServiceList } from '../../components/ratings/RatingsServiceList';
import { useTranslation } from 'react-i18next';

export const ServicesRatingsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [service, setService] = useState({});
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServiceAndRatings() {
            try {
                const serviceResponse = await getService(id);
                setService(serviceResponse.data);

                const appointmentsResponse = await getAppointmentsByService(id);
                const ratingsArray = [];
                for (let appointment of appointmentsResponse.data) {
                    const ratingsResponse = await getRatingByAppointment(appointment.id);
                    ratingsArray.push(...ratingsResponse.data);
                }
                setRatings(ratingsArray);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchServiceAndRatings();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                {t('ratings_for')} {service.name}
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <RatingsServiceList ratings={ratings} />
        </Container>
    );
};