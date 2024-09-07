import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import { createOffer, updateOffer, getOffer } from '../../api/offers.api';
import { getAllServices } from '../../api/services.api';
import { useTranslation } from 'react-i18next';

export function OfferForm({ isUpdate }) {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [services, setServices] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOfferAndServices() {
            if (isUpdate) {
                try {
                    const offerResponse = await getOffer(id);
                    const offer = offerResponse.data;
                    setName(offer.name);
                    setDescription(offer.description);
                    setDiscount(offer.discount);
                    setStartDate(offer.start_date.replace('Z', ''));
                    setEndDate(offer.end_date.replace('Z', ''));
                    setServices(offer.services);
                } catch (error) {
                    console.error("Error fetching offer:", error);
                }
            }
            try {
                const servicesResponse = await getAllServices();
                setAvailableServices(servicesResponse.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        }
        fetchOfferAndServices();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('discount', discount);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        services.forEach(service => {
            formData.append('services', service.id);
        });

        try {
            if (isUpdate) {
                await updateOffer(id, formData);
            } else {
                await createOffer(formData);
            }
            navigate('/offers');
        } catch (error) {
            console.error("Error creating/updating offer:", error);
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setIsModified(true);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setIsModified(true);
    };

    const handleDiscountChange = (e) => {
        setDiscount(e.target.value);
        setIsModified(true);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setIsModified(true);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setIsModified(true);
    };

    const handleServicesChange = (e) => {
        const selectedIds = e.target.value;
        const selectedServices = availableServices.filter(service => selectedIds.includes(service.id));
        setServices(selectedServices);
        setIsModified(true);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
        >
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title={isUpdate ? t('update_offer') : t('create_offer')} sx={{ textAlign: 'center' }} />
                            <Divider sx={{ bgcolor: 'grey.800' }} />
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField label={t('name_label')} value={name} onChange={handleNameChange} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('description_label')} value={description} onChange={handleDescriptionChange} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('discount_label')} type="number" value={discount} onChange={handleDiscountChange} required fullWidth sx={{ mb: 2 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField label={t('start_date')} type="datetime-local" InputLabelProps={{ shrink: true }} value={startDate} onChange={handleStartDateChange} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('end_date')} type="datetime-local" InputLabelProps={{ shrink: true }} value={endDate} onChange={handleEndDateChange} required fullWidth sx={{ mb: 2 }} />
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="services-label">{t('services_label')}</InputLabel>
                                                <Select
                                                    labelId="services-label"
                                                    multiple
                                                    value={services.map(service => service.id)}
                                                    onChange={handleServicesChange}
                                                    label={t('services_label')}
                                                >
                                                    {availableServices.map(service => (
                                                        <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        {isUpdate && isModified && (
                                            <Button variant="contained" color="primary" type="submit">
                                                {t('update_button')}
                                            </Button>
                                        )}
                                        {!isUpdate && (
                                            <Button variant="contained" color="primary" type="submit">
                                                {t('create_button')}
                                            </Button>
                                        )}
                                        <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => navigate('/offers')}>
                                            {t('cancel_button')}
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}