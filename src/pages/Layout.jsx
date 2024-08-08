import React, { useState, useEffect, useContext } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { Banner } from '../components/Banner';
import Stack from 'react-stackai';
import { AuthContext } from '../contexts/AuthContext';


export function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
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
                    height: 'calc(100vh - 60px)', // Ajusta esto según la altura de tu banner
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
            {token && (
                <Stack project="https://www.stack-ai.com/embed/3ad9fa4b-8561-4519-a5cb-b961d1a88276/ad47d57e-7f0c-4b19-868c-a1b6952e519d/66b4df063918d7cf8f7d390a" />
            )}
        </Box>
    );
}
