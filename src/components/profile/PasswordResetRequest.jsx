import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
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
        } catch (error) {
            setError(t('error_sending_password_reset_email'));
            console.error(t('error_sending_password_reset_email'), error);
        }
    };

    return (
        <Box>
            <Typography variant="h4">{t('reset_password')}</Typography>
            {message && <Typography color="primary">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">{t('send_reset_email')}</Button>
            </form>
        </Box>
    );
};