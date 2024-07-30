import React, { useContext } from 'react';
import { Avatar, Typography, Card, CardContent, Divider, Button, Grid, Box } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import SubscriptionIcon from '@mui/icons-material/Subscriptions';
import EngineeringIcon from '@mui/icons-material/Engineering';

export const ProfilePage = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Typography variant="h4">Please, log in to see your profile.</Typography>;
    }

    return (
        <Grid container spacing={3} justifyContent="center" sx={{ padding: 3 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Card sx={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            src={user.user.image}
                            alt={`${user.user.first_name} ${user.user.last_name}`}
                            sx={{
                                width: 160,
                                height: 160,
                                marginBottom: 2
                            }}
                            onError={(e) => { console.log('Image load error', e); }}
                        />
                        <Divider sx={{ width: '100%', my: 2 }} />
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h4" component="h1" textAlign="center">
                                {user.user.first_name} {user.user.last_name}
                            </Typography>
                            <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="subtitle1" component="p" sx={{ marginBottom: 1, display: 'flex', alignItems: 'center' }}>
                                    <EmailIcon sx={{ marginRight: 1 }} /> {user.user.email}
                                </Typography>
                                {user.user.role === 'client' && (
                                    <Typography variant="subtitle1" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <SubscriptionIcon sx={{ marginRight: 1 }} /> Subscription Plan: {user.subscription_plan}
                                    </Typography>
                                )}
                                {user.user.role === 'worker' && (
                                    <Typography variant="subtitle1" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EngineeringIcon sx={{ marginRight: 1 }} /> Specialty: {user.specialty}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button variant="contained" color="primary" sx={{ marginTop: 6, marginRight: 2 }}>
                                    Add medical histories
                                </Button>
                                <Button variant="contained" color="primary" sx={{ marginTop: 6 }}>
                                    Update
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};