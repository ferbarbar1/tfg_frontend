import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteOffer, getAllOffers } from '../../api/offers.api';

export function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 4;
    const [isActiveFilter, setIsActiveFilter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOffers() {
            try {
                const response = await getAllOffers();
                setOffers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOffers();
    }, []);

    const handleCreateOffer = () => {
        navigate('/offers/create');
    };

    const handleEdit = (id) => {
        navigate(`/offers/${id}/update/`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteOffer(id);
            setOffers(offers.filter(offer => offer.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilterToggle = () => {
        setIsActiveFilter(!isActiveFilter);
    };

    const filteredOffers = isActiveFilter
        ? offers.filter(offer => Date.parse(offer.start_date) <= Date.now() && Date.parse(offer.end_date) >= Date.now())
        : offers;

    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredOffers.length / offersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box sx={{ mr: 3, ml: 3 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                Offers
            </Typography>
            <Divider sx={{ marginBottom: 3, bgcolor: 'black', height: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button variant="contained" onClick={handleFilterToggle}>
                    {isActiveFilter ? 'Show All' : 'Show Active'}
                </Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={handleCreateOffer}>Create</Button>
            </Box>
            {currentOffers.length > 0 ? (
                currentOffers.map((offer, index) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    {offer.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                    {offer.description}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888', marginTop: 1 }}>
                                    Discount: <strong>{offer.discount}%</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Period: {new Date(offer.start_date).toLocaleString()} - {new Date(offer.end_date).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Services:
                                    <strong>
                                        {offer.services.map(service => service.name).join(', ')}
                                    </strong>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} container justifyContent="flex-end">
                                <IconButton color="primary" aria-label="edit offer" onClick={() => handleEdit(offer.id)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="default" aria-label="delete offer" onClick={() => handleDelete(offer.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    No offers yet.
                </Typography>
            )
            }
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                    Previous
                </Button>
                <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredOffers.length / offersPerPage)}>
                    Next
                </Button>
            </Box>
        </Box >
    );
}
