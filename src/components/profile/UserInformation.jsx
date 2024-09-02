import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Typography, Card, CardContent, Divider, Button, Grid, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CakeIcon from '@mui/icons-material/Cake';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WorkIcon from '@mui/icons-material/Work';
import { AuthContext } from '../../contexts/AuthContext';

export const UserInformation = ({ user }) => {
    const { user: authenticatedUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const baseURL = 'http://127.0.0.1:8000';
    const imageURL = user?.user?.image ? (user?.user?.image.startsWith('http') ? user?.user?.image : `${baseURL}${user?.user?.image}`) : null;

    const handleUpdate = () => {
        navigate('/my-profile/update');
    };

    const handlePasswordChange = () => {
        navigate('/my-profile/password-reset');
    };

    return (
        <Grid container spacing={3} justifyContent="center" sx={{ padding: 3 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Card sx={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            alt={user?.user?.first_name}
                            src={imageURL}
                            sx={{ width: 160, height: 160, marginBottom: 2 }}
                        />
                        <Divider sx={{ width: '100%', my: 2 }} />
                        <Box sx={{ width: '100%', maxWidth: '400px', mx: 'auto' }}>
                            <Typography variant="h4" component="h1" textAlign="center">
                                {user?.user?.first_name} {user?.user?.last_name}
                            </Typography>
                            <Box sx={{ marginTop: 2 }}>
                                <Grid container alignItems="center" sx={{ marginBottom: 1 }}>
                                    <Grid item sx={{ minWidth: '40px', textAlign: 'center', ml: 13 }}>
                                        <AlternateEmailIcon />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" component="p" sx={{ ml: 2 }}>
                                            {user?.user?.username}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" sx={{ marginBottom: 1 }}>
                                    <Grid item sx={{ minWidth: '40px', textAlign: 'center', ml: 13 }}>
                                        <EmailIcon />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="subtitle1" component="p" sx={{ ml: 2 }}>
                                            {user?.user?.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {user?.user?.date_of_birth && (
                                    <Grid container alignItems="center" sx={{ mb: 1 }}>
                                        <Grid item sx={{ minWidth: '40px', textAlign: 'center', ml: 13 }}>
                                            <CakeIcon />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="subtitle1" component="p" sx={{ ml: 2 }}>
                                                {new Date(user?.user?.date_of_birth).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}
                                {user?.user?.role === 'worker' && (
                                    <>
                                        <Grid container alignItems="center" sx={{ mb: 1 }}>
                                            <Grid item sx={{ minWidth: '40px', textAlign: 'center', ml: 13 }}>
                                                <EngineeringIcon />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="subtitle1" component="p" sx={{ ml: 2 }}>
                                                    {user?.specialty}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignItems="center" sx={{ mb: 1 }}>
                                            <Grid item sx={{ minWidth: '40px', textAlign: 'center', ml: 13 }}>
                                                <WorkIcon />
                                            </Grid>
                                            <Grid item xs>
                                                <Typography variant="subtitle1" component="p" sx={{ ml: 2 }}>
                                                    {user?.experience} year/s of experience
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                            {authenticatedUser?.user?.id === user?.user?.id && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button variant="contained" color="primary" sx={{ mt: 5 }} onClick={handleUpdate}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="primary" sx={{ mt: 5, ml: 2 }} onClick={handlePasswordChange}>
                                        Change Password
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};