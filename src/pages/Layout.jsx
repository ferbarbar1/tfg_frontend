import React, { useState, useEffect } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { Banner } from '../components/Banner';

export function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'auto' }}>
            <CssBaseline />
            <Banner onMenuClick={handleSidebarToggle} />
            <Sidebar open={sidebarOpen} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: sidebarOpen ? (isMobile ? '70px' : '260px') : '70px',
                    transition: theme.transitions.create(['margin-left'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginTop: '60px', // Ajusta esto según la altura de tu banner
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
