import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const TermsAndConditions = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('terms_and_conditions_title')}
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_1_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_1_content')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_2_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_2_content')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_3_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_3_content')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_4_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_4_content')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_5_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_5_content')}
                </Typography>
            </Box>
            <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                    {t('section_6_title')}
                </Typography>
                <Typography variant="body1" paragraph>
                    {t('section_6_content')}
                </Typography>
            </Box>
        </Container>
    );
};