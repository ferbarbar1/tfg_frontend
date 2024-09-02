import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/password-reset/', { email });
            setMessage('Password reset email sent.');
        } catch (error) {
            setError('Error sending password reset email');
            console.error('Error sending password reset email', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4">Reset Password</Typography>
            {message && <Typography color="primary">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">Send Reset Email</Button>
            </form>
        </Box>
    );
};
