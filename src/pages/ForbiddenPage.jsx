import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ForbiddenPage = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ marginBottom: 4 }}>
                    {t('error_403')}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ marginBottom: 6 }}>
                    {t('forbidden_message')}
                </Typography>
                <Button variant="contained" color="error" onClick={() => window.location.replace("/")}>
                    {t('back_button')}
                </Button>
            </Box>
        </Container>
    );
};