import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Paper, Alert, Divider } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const ChangePasswordAuth = () => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match'));
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
            setError(t('error_changing_password'));
            console.error(t('error_changing_password'), error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('change_password')}
                </Typography>
                {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
                <Divider sx={{ marginBottom: 2 }} />
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={t('new_password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label={t('confirm_new_password')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit">
                            {t('change_password')}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};