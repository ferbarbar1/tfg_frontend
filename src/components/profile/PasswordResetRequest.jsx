import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Paper, Alert, Divider } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const PasswordResetRequest = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/password-reset/', { email });
            setMessage(t('password_reset_email_sent'));
            setError('');
        } catch (error) {
            setError(t('error_sending_password_reset_email'));
            setMessage('');
            console.error(t('error_sending_password_reset_email'), error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t('reset_password')}
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                <Typography variant="body1" align="center" paragraph>
                    {t('enter_registered_email')}
                </Typography>
                {message && <Alert severity="success" sx={{ marginBottom: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={t('email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ marginBottom: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" type="submit">
                            {t('send_reset_email')}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};