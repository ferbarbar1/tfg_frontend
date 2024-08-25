import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
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

                {user && user.user && (
                    <>
                        <Typography variant="subtitle1">
                            Hello,{' '}
                            <Link to="/my-profile" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                                {user.user.username}
                                <PersonIcon sx={{ marginLeft: 2 }} />
                            </Link>
                            <Link to="/my-chats" style={{ color: '#ecf0f1' }}>
                                <ChatIcon sx={{ marginLeft: 2 }} />
                            </Link>
                            <Link to="/my-notifications" style={{ color: '#ecf0f1' }}>
                                <NotificationsIcon sx={{ marginLeft: 2 }} />
                            </Link>
                        </Typography>
                    </>
                )}

            </Toolbar>
        </AppBar>
    );
}
