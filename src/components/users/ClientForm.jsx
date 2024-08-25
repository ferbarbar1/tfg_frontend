import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, updateClient, createClient } from '../../api/clients.api';
import { TextField, Button, Box, Card, CardContent, Grid } from '@mui/material';

export function ClientForm({ isUpdate }) {
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
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
                                label="First Name"
                                name="firstName"
                                autoComplete="firstName"
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
                                label="Last Name"
                                name="lastName"
                                autoComplete="lastName"
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
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="dateOfBirth"
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
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
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="repeatPassword"
                                        label="Repeat Password"
                                        type="password"
                                        id="repeatPassword"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" type="submit">
                            {isUpdate ? 'Update' : 'Create'}
                        </Button>
                        <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}