import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorker, updateWorker, createWorker } from '../../api/workers.api';
import { TextField, Button, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function WorkerForm({ isUpdate }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [experience, setExperience] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isModified, setIsModified] = useState(false);
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchWorker() {
            if (isUpdate) {
                try {
                    const response = await getWorker(id);
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
                    setPassword(worker.user.password);
                } catch (error) {
                    console.error("Error fetching worker: ", error);
                }
            }
        }
        fetchWorker();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};

        // Validar que la fecha de nacimiento no sea futura
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (birthDate > today) {
            newErrors.dateOfBirth = t('birth_date_future_error');
        }

        // Validar que el número de años de experiencia no sea negativo
        if (experience < 0) {
            newErrors.experience = t('negative_experience_error');
        }

        if (!isUpdate) {
            // Validar que las contraseñas coincidan
            if (password !== repeatPassword) {
                newErrors.passwordMatch = t('passwords_do_not_match');
            }

            // Validar que la contraseña cumpla con los requisitos
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                newErrors.password = t('password_invalid');
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const userData = {
                first_name: firstName,
                last_name: lastName,
                date_of_birth: dateOfBirth,
            };

            if (username !== originalUsername) {
                userData.username = username;
            }

            if (email !== originalEmail) {
                userData.email = email;
            }

            if (isUpdate) {
                await updateWorker(id, {
                    user: userData,
                    specialty: specialty,
                    experience: experience,
                });
            } else {
                await createWorker({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        date_of_birth: dateOfBirth,
                        password: password,
                    },
                    specialty: specialty,
                    experience: experience,
                });
            }
            navigate('/users?tab=workers');
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

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
        setIsModified(true);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
        setIsModified(true);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setIsModified(true);
    };

    const handleDateOfBirthChange = (e) => {
        setDateOfBirth(e.target.value);
        setIsModified(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsModified(true);
    };

    const handleSpecialtyChange = (e) => {
        setSpecialty(e.target.value);
        setIsModified(true);
    };

    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
        setIsModified(true);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setIsModified(true);
    };

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
        setIsModified(true);
    };

    return (
        <Card>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="text"
                                id="firstName"
                                label={t('first_name_label')}
                                name="firstName"
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type='text'
                                id="lastName"
                                label={t('last_name_label')}
                                name="lastName"
                                value={lastName}
                                onChange={handleLastNameChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type='text'
                                id="username"
                                label={t('username_label')}
                                name="username"
                                value={username}
                                onChange={handleUsernameChange}
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
                                onChange={handleDateOfBirthChange}
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
                                type='email'
                                id="email"
                                label={t('email_label')}
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                error={!!errors.email}
                                helperText={errors.email && t('email_exists')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type='text'
                                id="specialty"
                                label={t('specialty_label')}
                                name="specialty"
                                value={specialty}
                                onChange={handleSpecialtyChange}
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
                                onChange={handleExperienceChange}
                                error={!!errors.experience}
                                helperText={errors.experience}
                            />
                        </Grid>
                        {!isUpdate && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label={t('password_label')}
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        error={!!errors.password}
                                        helperText={errors.password && t('password_invalid_message')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="repeatPassword"
                                        label={t('repeat_password_label')}
                                        type="password"
                                        id="repeatPassword"
                                        value={repeatPassword}
                                        onChange={handleRepeatPasswordChange}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        {!isUpdate && errors.passwordMatch && <Typography color="error">{errors.passwordMatch}</Typography>}
                    </Box>
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
                        <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => navigate(-1)}>
                            {t('cancel_button')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}