import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, updateClient, createClient } from '../../api/clients.api';
import { TextField, Button, Box, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ClientForm({ isUpdate }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isModified, setIsModified] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchClient() {
            if (isUpdate) {
                try {
                    const response = await getClient(id);
                    const client = response.data;
                    setUsername(client.user.username);
                    setOriginalUsername(client.user.username);
                    setFirstName(client.user.first_name);
                    setLastName(client.user.last_name);
                    setEmail(client.user.email);
                    setOriginalEmail(client.user.email);
                    setDateOfBirth(client.user.date_of_birth);
                    setPassword(client.user.password);
                } catch (error) {
                    console.error("Error fetching client", error);
                }
            }
        }
        fetchClient();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

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
                await updateClient(id, {
                    user: userData,
                });
            } else {
                await createClient({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        date_of_birth: dateOfBirth,
                        password: password
                    },
                });
            }
            navigate('/users?tab=clients');
        } catch (error) {
            console.error("Error creating/updating client", error);
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
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label={t('first_name_label')}
                                name="firstName"
                                autoComplete="firstName"
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
                                id="lastName"
                                label={t('last_name_label')}
                                name="lastName"
                                autoComplete="lastName"
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
                                id="username"
                                label={t('username_label')}
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={handleUsernameChange}
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
                                autoComplete="email"
                                value={email}
                                onChange={handleEmailChange}
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
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={handlePasswordChange}
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
                            {t('cancel')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}