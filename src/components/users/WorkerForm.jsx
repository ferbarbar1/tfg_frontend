import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorker, updateWorker, createWorker, deleteWorker } from '../../api/workers.api';
import { TextField, Button, Box, Typography, Card, CardContent, CardHeader, Divider } from '@mui/material';

export function WorkerForm({ isUpdate }) {
    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [salary, setSalary] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [error, setError] = useState(null);
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
                    setPassword(worker.user.password);
                    setSalary(worker.salary);
                    setSpecialty(worker.specialty);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchWorker();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (!username || !firstName || !lastName || !email || !salary || !specialty || (!isUpdate && !password)) {
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
                await updateWorker(id, {
                    user: userData,
                    salary: salary,
                    specialty: specialty
                });
            } else {
                await createWorker({
                    user: {
                        username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    },
                    salary: salary,
                    specialty: specialty
                });
            }
            navigate('/users?tab=workers');
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
            await deleteWorker(id);
            navigate('/users?tab=workers');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader title={isUpdate ? 'Update Worker' : 'Create Worker'} sx={{ textAlign: 'center' }} />
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="salary"
                        label="Salary"
                        name="salary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="specialty"
                        label="Specialty"
                        name="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
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