import React from 'react';
import { Typography, Grid, Paper, Container, Avatar } from '@mui/material';
import { AccessTime, Phone, LocationOn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';

export const AboutUsPage = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                        <Avatar
                            alt="Equipo de Fisioterapeutas"
                            src={logo}
                            sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                        />
                        <Typography variant="h6" gutterBottom>
                            {t('who_we_are')}
                        </Typography>
                        <Typography variant="body1">
                            {t('who_we_are_description')}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                        <AccessTime sx={{ fontSize: 50, color: 'primary.main', mb: 4, mt: 5 }} />
                        <Typography variant="h6" gutterBottom>
                            {t('schedules')}
                        </Typography>
                        <Typography variant="body1">{t('weekdays_schedule')}</Typography>
                        <Typography variant="body1">{t('weekends_schedule')}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                        <Phone sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            {t('contact')}
                        </Typography>
                        <Typography variant="body1">{t('phone')}</Typography>
                        <Typography variant="body1">{t('email_about_us')}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                        <LocationOn sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            {t('address')}
                        </Typography>
                        <Typography variant="body1">{t('clinic_address')}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};