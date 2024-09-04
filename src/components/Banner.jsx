import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Select, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationsContext } from '../contexts/NotificationsContext';
import { useTranslation } from 'react-i18next';

export function Banner({ onMenuClick }) {
    const { user } = useContext(AuthContext);
    const { notifications } = useContext(NotificationsContext);
    const { t, i18n } = useTranslation();

    const unreadCount = notifications.filter(notification => !notification.is_read).length;

    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    const currentLanguage = i18n.language || 'es';

    return (
        <AppBar position="fixed" sx={{ height: '60px', zIndex: 1201, backgroundColor: '#2c3e50' }}>
            <Toolbar>
                <Tooltip title={t('banner_menu')}>
                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        edge="start"
                        onClick={onMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" style={{ flexGrow: 1, color: '#ecf0f1' }}>
                    FisioterAppIA Clinic
                </Typography>

                {user && user.user && (
                    <>
                        <Typography variant="subtitle1">
                            {t('banner_welcome')}, {' '}
                            <Link to="/my-profile" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                                {user.user.username}
                                <Tooltip title={t('banner_profile')}>
                                    <PersonIcon sx={{ marginLeft: 2 }} />
                                </Tooltip>
                            </Link>
                            <Link to="/chat" style={{ color: '#ecf0f1' }}>
                                <Tooltip title={t('banner_chats')}>
                                    <ChatIcon sx={{ marginLeft: 2 }} />
                                </Tooltip>
                            </Link>
                            <Link to="/my-notifications" style={{ color: '#ecf0f1' }}>
                                <Tooltip title={t('banner_notifications')}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon sx={{ marginLeft: 2 }} />
                                    </Badge>
                                </Tooltip>
                            </Link>
                        </Typography>
                    </>
                )}

                <Select
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    variant="outlined"
                    sx={{
                        marginLeft: 2,
                        color: '#ecf0f1',
                        borderColor: '#ecf0f1',
                        fontFamily: 'Arial, sans-serif',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '& .MuiSelect-icon': {
                            color: '#ecf0f1',
                        },
                    }}
                    inputProps={{ sx: { color: '#ecf0f1' } }}
                >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                </Select>
            </Toolbar>
        </AppBar>
    );
}