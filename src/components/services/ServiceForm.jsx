import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService, createService, deleteService } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';
import { Container, Box, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AttachFile from '@mui/icons-material/AttachFile';

export function ServiceForm({ isUpdate }) {
    const { t } = useTranslation();
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
            height="80vh"
        >
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title={isUpdate ? t('update_service_button') : t('create_service_button')} sx={{ textAlign: 'center' }} />
                            <Divider sx={{ bgcolor: 'grey.800' }} />
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField label={t('name_label')} value={name} onChange={(e) => setName(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('description_label')} value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('price_label')} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="workers-label">{t('workers_label')}</InputLabel>
                                                <Select
                                                    labelId="workers-label"
                                                    multiple
                                                    value={workers}
                                                    onChange={(e) => setWorkers(e.target.value)}
                                                    label={t('workers')}
                                                >
                                                    {allWorkers.map(worker => (
                                                        <MenuItem key={worker.id} value={worker.id}>{worker.user.username}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                {imagePreviewUrl && (
                                                    <Box sx={{ mb: 2 }}>
                                                        <img src={imagePreviewUrl} alt={t('service_preview')} style={{ width: '50%', height: 'auto', borderRadius: '8px' }} />
                                                    </Box>
                                                )}
                                                {imagePreviewUrl &&
                                                    <Typography variant="subtitle1">{t('service_preview')}</Typography>
                                                }
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="icon-button-file"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                />
                                                <label htmlFor="icon-button-file">
                                                    <Tooltip title={t('upload_image')} placement="bottom">
                                                        <IconButton color="primary" aria-label="upload picture" component="span">
                                                            <AttachFile />
                                                        </IconButton>
                                                    </Tooltip>
                                                </label>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button variant="contained" color="primary" type="submit">
                                            {isUpdate ? t('update_button') : t('create_button')}
                                        </Button>
                                        {isUpdate &&
                                            <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                                                {t('delete_button')}
                                            </Button>
                                        }
                                        <Button variant="contained" color="inherit" onClick={() => navigate('/services')} sx={{ ml: 2 }}>
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