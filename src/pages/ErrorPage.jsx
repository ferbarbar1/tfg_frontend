import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export const ErrorPage = () => {
  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ marginBottom: 4 }}>
          404 Not Found
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ marginBottom: 6 }}>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button variant="contained" color="error" onClick={() => window.location.replace("/")}>
          Back
        </Button>
      </Box>
    </Container>
  );
};