import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, updateClient, createClient, deleteClient } from '../../api/clients.api';
import { TextField, Button, Box, Typography, Card, CardContent, CardHeader, Divider } from '@mui/material';

export function ClientForm({ isUpdate }) {
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [subscriptionPlan, setSubscriptionPlan] = useState("FREE");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchclient() {
            if (isUpdate) {
                try {
                    const response = await getClient(id);
                    const client = response.data;
                    setUsername(client.user.username);
                    setOriginalUsername(client.user.username);
                    setFirstName(client.user.first_name);
                    setLastName(client.user.last_name);
                    setEmail(client.user.email);
                    setPassword(client.user.password);
                    setSubscriptionPlan(client.subscription_plan);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchclient();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!username || !firstName || !lastName || !email || (!isUpdate && !password)) {
            setError('All fields are required');
            return;
        }
        try {
            const userData = {
                first_name: firstName,
                last_name: lastName,
                email: email
            };
            if (username !== originalUsername) {
                userData.username = username;
            }
            if (isUpdate) {
                await updateClient(id, {
                    user: userData,
                    subscription_plan: subscriptionPlan
                });
            } else {
                await createClient({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    },
                    subscription_plan: subscriptionPlan
                });
            }
            navigate('/users?tab=clients');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred');
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteClient(id);
            navigate('/users?tab=clients');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader title={isUpdate ? 'Update Client' : 'Create Client'} sx={{ textAlign: 'center' }} />
            <Divider sx={{ bgcolor: 'grey.800' }} />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {error && <Typography variant="body2" color="error">{error}</Typography>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="firstName"
                        autoFocus
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lastName"
                        autoFocus
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="subscriptionPlan"
                        label="Subscription Plan"
                        name="subscriptionPlan"
                        autoComplete="subscriptionPlan"
                        autoFocus
                        value={subscriptionPlan}
                        onChange={(e) => setSubscriptionPlan(e.target.value)}
                    />
                    {!isUpdate && (
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
                    )}
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
                </Box>
            </CardContent>
        </Card>
    );
}