import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService, createService, deleteService } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';
import { Container, Box, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, Typography, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

    const [openDialog, setOpenDialog] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [errors, setErrors] = useState({});

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

        const newErrors = {};

        // Validar que el precio no sea negativo
        if (price < 0) {
            newErrors.price = t('negative_price_error');
        }

        // Validar que la imagen sea un archivo de imagen
        if (image && !image.type.startsWith('image/')) {
            newErrors.image = t('invalid_image_error');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

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

    const handleNameChange = (e) => {
        setName(e.target.value);
        setIsModified(true);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setIsModified(true);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
        setIsModified(true);
    };

    const handleWorkersChange = (e) => {
        setWorkers(e.target.value);
        setIsModified(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setErrors(prevErrors => ({ ...prevErrors, image: null }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, image: t('invalid_image_error') }));
        }
        setIsModified(true);
    };

    const handleDelete = () => {
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteService(id);
            navigate('/services');
        } catch (error) {
            console.error(error);
        } finally {
            setOpenDialog(false);
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
                                            <TextField label={t('name_label')} value={name} onChange={handleNameChange} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('description_label')} value={description} onChange={handleDescriptionChange} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label={t('price_label')} type="number" value={price} onChange={handlePriceChange} required fullWidth sx={{ mb: 2 }} error={!!errors.price} helperText={errors.price} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="workers-label">{t('workers_label')}</InputLabel>
                                                <Select
                                                    labelId="workers-label"
                                                    multiple
                                                    value={workers}
                                                    onChange={handleWorkersChange}
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
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        startIcon={<CloudUploadIcon />}
                                                        sx={{ mr: 2 }}
                                                    >
                                                        {t('upload_image')}
                                                        <input
                                                            accept="image/*"
                                                            type="file"
                                                            hidden
                                                            onChange={handleImageChange}
                                                        />
                                                    </Button>
                                                </Box>
                                                {errors.image && <Typography color="error">{errors.image}</Typography>}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        {!isUpdate &&
                                            <Button variant="contained" color="primary" type="submit">
                                                {t('create_button')}
                                            </Button>
                                        }
                                        {isUpdate && isModified &&
                                            <Button variant="contained" color="primary" type="submit" sx={{ ml: 2 }}>
                                                {t('update_button')}
                                            </Button>
                                        }
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

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('confirm_delete')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        {t('cancel_button')}
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        {t('confirm_button')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}