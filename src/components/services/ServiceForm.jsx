import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService, createService, deleteService } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';
import { Container, Box, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';


export function ServiceForm({ isUpdate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [workers, setWorkers] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [allWorkers, setAllWorkers] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServiceAndWorkers() {
            if (isUpdate) {
                try {
                    const serviceResponse = await getService(id);
                    const service = serviceResponse.data;
                    setName(service.name);
                    setDescription(service.description);
                    setPrice(service.price);
                    setWorkers(service.workers.map(worker => worker.id));
                    setImagePreviewUrl(service.image);
                } catch (error) {
                    console.error(error);
                }
            }

            try {
                const workersResponse = await getAllWorkers();
                setAllWorkers(workersResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchServiceAndWorkers();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        workers.forEach(worker => {
            formData.append('workers', worker);
        });
        if (image) {
            formData.append('image', image);
        }

        try {
            if (isUpdate) {
                await updateService(id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await createService(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
    };

    const handleDelete = async () => {
        try {
            await deleteService(id);
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh" // Asegura que la caja ocupe toda la altura de la vista
        >
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title={isUpdate ? 'Update service' : 'Create service'} sx={{ textAlign: 'center' }} />
                            <Divider sx={{ bgcolor: 'grey.800' }} />
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="workers-label">Workers</InputLabel>
                                                <Select
                                                    labelId="workers-label"
                                                    multiple
                                                    value={workers}
                                                    onChange={(e) => setWorkers(e.target.value)}
                                                    label="Workers"
                                                >
                                                    {allWorkers.map(worker => (
                                                        <MenuItem key={worker.id} value={worker.id}>{worker.user.username}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Box>
                                                <input type="file" onChange={handleImageChange} />
                                                {imagePreviewUrl && <img src={imagePreviewUrl} alt="Service Preview" style={{ width: '40%', height: 'auto' }} />}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button variant="contained" color="primary" type="submit">
                                            {isUpdate ? 'Update' : 'Create'}
                                        </Button>
                                        {isUpdate &&
                                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                                                Delete
                                            </Button>
                                        }
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