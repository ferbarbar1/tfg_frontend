import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClient, updateClient } from '../../api/clients.api';
import { getWorker, updateWorker } from '../../api/workers.api';
import { TextField, Button, Box, Card, CardContent, Grid, Avatar, Typography } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function UpdateProfileForm() {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [experience, setExperience] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const baseURL = 'http://127.0.0.1:8000';
    const imageURL = user?.user?.image ? (user?.user?.image.startsWith('http') ? user?.user?.image : `${baseURL}${user?.user?.image}`) : null;

    useEffect(() => {
        async function fetchUser() {
            try {
                if (user.user.role === 'client') {
                    const response = await getClient(user.id);
                    const client = response.data;
                    setUsername(client.user.username);
                    setOriginalUsername(client.user.username);
                    setFirstName(client.user.first_name);
                    setLastName(client.user.last_name);
                    setEmail(client.user.email);
                    setOriginalEmail(client.user.email);
                    setDateOfBirth(client.user.date_of_birth);
                } else if (user.user.role === 'worker') {
                    const response = await getWorker(user.id);
                    const worker = response.data;
                    setUsername(worker.user.username);
                    setOriginalUsername(worker.user.username);
                    setFirstName(worker.user.first_name);
                    setLastName(worker.user.last_name);
                    setEmail(worker.user.email);
                    setOriginalEmail(worker.user.email);
                    setDateOfBirth(worker.user.date_of_birth);
                    setSpecialty(worker.specialty);
                    setExperience(worker.experience);
                }
            } catch (error) {
                console.error("Error fetching user", error);
            }
        }
        fetchUser();
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            setErrors({ image: t('invalid_image_error') });
            return;
        }
        setImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setErrors((prevErrors) => ({ ...prevErrors, image: null }));
    };

    const handleCancelImageChange = () => {
        setImage(null);
        setImagePreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};

        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (birthDate > today) {
            newErrors.dateOfBirth = t('birth_date_future_error');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const formData = new FormData();

            formData.append('user.first_name', firstName);
            formData.append('user.last_name', lastName);
            formData.append('user.date_of_birth', dateOfBirth);

            if (username !== originalUsername) {
                formData.append('user.username', username);
            }

            if (email !== originalEmail) {
                formData.append('user.email', email);
            }

            if (image) {
                formData.append('user.image', image);
            }

            if (user.user.role === 'worker') {
                formData.append('specialty', specialty);
                formData.append('experience', experience);
            }

            let response;
            if (user.user.role === 'client') {
                response = await updateClient(user.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else if (user.user.role === 'worker') {
                response = await updateWorker(user.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.status === 200) {
                navigate('/my-profile');
                window.location.reload();
            } else {
                console.error("Error updating user", response);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const backendErrors = error.response.data.user;
                const apiErrors = {};

                if (backendErrors.email) {
                    apiErrors.email = backendErrors.email[0];
                }
                if (backendErrors.username) {
                    apiErrors.username = backendErrors.username[0];
                }

                setErrors(apiErrors);
            } else {
                console.error("Error desconocido:", error);
            }
        }
    };

    return (
        <Card>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                alt={firstName}
                                src={imageURL}
                                sx={{ width: 160, height: 160, marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                            >
                                {t('upload_profile_picture')}
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {imagePreviewUrl && (
                                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                    <Grid item>
                                        <Avatar
                                            alt={t('profile_preview')}
                                            src={imagePreviewUrl}
                                            sx={{ width: 160, height: 160 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={handleCancelImageChange}
                                        >
                                            {t('cancel_button')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                            {errors.image && (
                                <Typography color="error" variant="body2" align="center">
                                    {errors.image}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label={t('first_name_label')}
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label={t('last_name_label')}
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label={t('username_label')}
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={!!errors.username}
                                helperText={errors.username && t('username_exists')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="dateOfBirth"
                                label={t('date_of_birth_label')}
                                name="dateOfBirth"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label={t('email_label')}
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!errors.email}
                                helperText={errors.email && t('email_exists')}
                            />
                        </Grid>
                        {user.user.role === 'worker' && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="specialty"
                                        label={t('specialty_label')}
                                        name="specialty"
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        type='number'
                                        required
                                        fullWidth
                                        id="experience"
                                        label={t('experience_label')}
                                        name="experience"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" type="submit">
                            {t('update_button')}
                        </Button>
                        <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => navigate(-1)}>
                            {t('cancel_button')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}