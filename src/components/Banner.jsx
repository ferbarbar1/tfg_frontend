import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../contexts/AuthContext';

export function Banner({ onMenuClick }) {
    const { user } = useContext(AuthContext);

    return (
        <AppBar position="fixed" sx={{ height: '60px', zIndex: 1201, backgroundColor: '#2c3e50' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    edge="start"
                    onClick={onMenuClick}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1, color: '#ecf0f1' }}>
                    FisioterAppIA Clinic
                </Typography>
                <Typography variant="subtitle1">
                    Hello, {user && user.user ? user.user.username : 'Guest'}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
