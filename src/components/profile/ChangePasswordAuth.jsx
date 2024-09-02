import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

export const ChangePasswordAuth = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(
                'http://127.0.0.1:8000/change-password/',
                { new_password1: password, new_password2: confirmPassword },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
            navigate('/my-profile');
        } catch (error) {
            setError('Error changing password');
            console.error("Error changing password", error);
        }
    };

    return (
        <Box>
            <Typography variant="h4">Change Password</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">Change Password</Button>
            </form>
        </Box>
    );
};
