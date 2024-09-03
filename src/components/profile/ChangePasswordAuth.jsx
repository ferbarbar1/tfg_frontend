import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
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
        <Box>
            <Typography variant="h4">{t('change_password')}</Typography>
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
                <Button variant="contained" color="primary" type="submit">{t('change_password')}</Button>
            </form>
        </Box>
    );
};