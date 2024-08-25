import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Grid, IconButton, Paper, Typography, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteOffer, getAllOffers } from '../../api/offers.api';
import { truncateText } from '../../utils/auxFunctions';

export function OffersList() {
    const [offers, setOffers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const offersPerPage = 4;
    const [sortCriteria, setSortCriteria] = useState('date');
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

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const isOfferActive = (offer) => {
        const now = new Date();
        return new Date(offer.start_date) <= now && now <= new Date(offer.end_date);
    };

    const sortedOffers = [...offers].sort((a, b) => {
        if (sortCriteria === 'date') {
            return new Date(b.start_date) - new Date(a.start_date);
        } else if (sortCriteria === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortCriteria === 'status') {
            return isOfferActive(b) - isOfferActive(a);
        }
        return 0;
    });

    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffers = sortedOffers.slice(indexOfFirstOffer, indexOfLastOffer);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(sortedOffers.length / offersPerPage)) {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 2 }}>
                {currentOffers.length > 0 && (
                    <FormControl>
                        <InputLabel id="sort-label">Order by</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sortCriteria}
                            onChange={handleSortChange}
                            label="Order by"
                        >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                        </Select>
                    </FormControl>
                )}
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
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', display: 'flex', alignItems: 'center' }}>
                                    {truncateText(offer.name, 10)}
                                    <Tooltip title={isOfferActive(offer) ? "Active" : "Inactive"}>
                                        {isOfferActive(offer) ? (
                                            <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                                        ) : (
                                            <CancelIcon color="error" sx={{ ml: 1 }} />
                                        )}
                                    </Tooltip>
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                    {truncateText(offer.description, 40)}
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
            )}
            {offers.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(sortedOffers.length / offersPerPage)}>
                        Next
                    </Button>
                </Box>
            )}
        </Box >
    );
}