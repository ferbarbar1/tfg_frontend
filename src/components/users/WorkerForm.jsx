import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorker, updateWorker, createWorker } from '../../api/workers.api';
import { TextField, Button, Box, Card, CardContent, Grid } from '@mui/material';

export function WorkerForm({ isUpdate }) {
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
            console.error("Error creating/updating worker: ", error);
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="specialty"
                                label="Specialties"
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
                                label="Experience (years)"
                                name="experience"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
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