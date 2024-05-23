import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../contexts/AuthContext';

export function Banner({ onMenuClick }) {
    const { user } = useContext(AuthContext);

    return (
        <AppBar position="fixed" sx={{ height: '60px' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    FisioterAppIA Clinic
                </Typography>
                <Typography variant="subtitle1">
                    Welcome, {user && user.user ? user.user.username : 'Guest'}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
