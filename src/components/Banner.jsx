import React, { useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Select, MenuItem, Tooltip, useMediaQuery } from '@mui/material';
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

    // Usar una media query manual para detectar pantallas pequeñas
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <AppBar position="fixed" sx={{ height: '60px', zIndex: 1201, backgroundColor: '#2c3e50' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: isMobile ? '0 8px' : '0 24px', ml: isMobile ? 3 : 0 }}>
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

                {!isMobile && (
                    <Typography variant="h6" sx={{ color: '#ecf0f1', flexGrow: 1, textAlign: isMobile ? 'center' : 'left' }}>
                        FisioterAppIA Clinic
                    </Typography>
                )}

                {user && user.user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
                        {!isMobile && (
                            <Typography variant="subtitle1" sx={{ color: '#ecf0f1' }}>
                                {t('banner_welcome')}, {' '}
                                <Link to="/my-profile" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                                    {user.user.username}
                                </Link>
                            </Typography>
                        )}

                        <Link to="/my-profile" style={{ color: '#ecf0f1' }}>
                            <Tooltip title={t('banner_profile')}>
                                <PersonIcon />
                            </Tooltip>
                        </Link>

                        <Link to="/chat" style={{ color: '#ecf0f1' }}>
                            <Tooltip title={t('banner_chats')}>
                                <ChatIcon />
                            </Tooltip>
                        </Link>

                        <Link to="/my-notifications" style={{ color: '#ecf0f1' }}>
                            <Tooltip title={t('banner_notifications')}>
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </Tooltip>
                        </Link>

                        <Select
                            value={currentLanguage}
                            onChange={handleLanguageChange}
                            variant="outlined"
                            sx={{
                                color: '#ecf0f1',
                                borderColor: '#ecf0f1',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiSelect-icon': {
                                    color: '#ecf0f1',
                                },
                            }}
                            inputProps={{ sx: { color: '#ecf0f1' } }}
                            size={isMobile ? 'small' : 'medium'}
                        >
                            <MenuItem value="es">ESP</MenuItem>
                            <MenuItem value="en">ENG</MenuItem>
                        </Select>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
}
