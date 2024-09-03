import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const ChangePasswordUnauth = () => {
    const { t } = useTranslation();
    const { uid, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match'));
            return;
        }

        try {
            await axios.post(
                `http://127.0.0.1:8000/password-reset-confirm/${uid}/${token}/`,
                { new_password1: password, new_password2: confirmPassword }
            );
            navigate('/');
        } catch (error) {
            setError(t('error_changing_password'));
            console.error(t('error_changing_password'), error);
        }
    };

    return (
        <Box>
            <Typography variant="h4">{t('reset_password')}</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label={t('new_password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <TextField
                    label={t('confirm_new_password')}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                    sx={{ my: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">{t('reset_password')}</Button>
            </form>
        </Box>
    );
};