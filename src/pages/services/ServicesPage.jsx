import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Box, Typography, Paper, MobileStepper, Divider } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { getAllServices } from '../../api/services.api';
import { AuthContext } from '../../contexts/AuthContext';

export function ServicesPage() {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await getAllServices();
                setServices(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchServices();
    }, []);

    const maxSteps = services.length;

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
        }, 4000); // Cambia el slide cada 4 segundos
        return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
    }, [activeStep, maxSteps]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreateService = () => {
        navigate('/services/create');
    };

    const handleClick = (serviceId) => {
        if (user.user.role === 'owner') {
            navigate(`/services/${serviceId}/update/`);
        }
        if (user.user.role === 'client') {
            navigate(`/services/${serviceId}/details/`);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                {user && user.user && user.user.role === 'owner' &&
                    <Button variant="primary" onClick={handleCreateService}>Create Service</Button>
                }
            </div>
            <Card sx={{ maxWidth: { xs: '90%', sm: 800 }, flexGrow: 1, m: { xs: 'auto', sm: 4 } }}>
                <CardHeader
                    title={services[activeStep]?.name}
                    titleTypographyProps={{ align: 'center' }}
                />
                <Divider />
                <CardContent>
                    <Box sx={{ maxWidth: 800, flexGrow: 1 }}>
                        <Button onClick={() => handleClick(services[activeStep]?.id)} sx={{
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                            '&:focus': {
                                outline: 'none',
                            },
                        }}>
                            <Box
                                component="img"
                                sx={{
                                    height: { xs: '50vh', sm: 400 }, // Altura del 50% de la altura de la pantalla en pantallas pequeñas, 400 en pantallas más grandes
                                    width: { xs: '100%', sm: 700 }, // Ancho del 100% en pantallas pequeñas, 700 en pantallas más grandes
                                    display: 'block',
                                    overflow: 'hidden',
                                    objectFit: 'contain',
                                }}
                                src={services[activeStep]?.image}
                                alt={services[activeStep]?.name}
                            />
                        </Button>
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            nextButton={
                                <Button size="large" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                    Next
                                    <KeyboardArrowRight />
                                </Button>
                            }
                            backButton={
                                <Button size="large" onClick={handleBack} disabled={activeStep === 0}>
                                    <KeyboardArrowLeft />
                                    Back
                                </Button>
                            }
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}