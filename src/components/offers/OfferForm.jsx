import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import { createOffer, updateOffer, getOffer } from '../../api/offers.api';
import { getAllServices } from '../../api/services.api';

export function OfferForm({ isUpdate }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [services, setServices] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
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
                            <CardHeader title={isUpdate ? 'Update offer' : 'Create offer'} sx={{ textAlign: 'center' }} />
                            <Divider sx={{ bgcolor: 'grey.800' }} />
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="Discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField label="Start Date" type="datetime-local" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="End Date" type="datetime-local" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="services-label">Services</InputLabel>
                                                <Select
                                                    labelId="services-label"
                                                    multiple
                                                    value={services.map(service => service.id)}
                                                    onChange={(e) => {
                                                        const selectedIds = e.target.value;
                                                        const selectedServices = availableServices.filter(service => selectedIds.includes(service.id));
                                                        setServices(selectedServices);
                                                    }}
                                                    label="Services"
                                                >
                                                    {availableServices.map(service => (
                                                        <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button variant="contained" color="primary" type="submit">
                                            {isUpdate ? 'Update' : 'Create'}
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