import React, { useContext } from "react";
import { List, ListItemIcon, ListItemText, ListItemButton, Divider, useTheme } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NAVLINKS } from "../utils/navLinks";
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Sidebar({ open }) {
    const theme = useTheme();
    const { token, setToken, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <List sx={{
            width: open ? 260 : 70,
            transition: 'width 0.2s',
            position: 'fixed',
            top: 60, // Ajusta esto según la altura de tu banner
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#2c3e50',
            boxShadow: '2px 0px 5px rgba(0,0,0,0.5)',
            padding: '10px',
            color: '#ecf0f1',
            height: 'calc(100% - 60px)',
            zIndex: theme.zIndex.drawer + 1
        }}>

            {NAVLINKS.map((link) => {
                if (!link.public && (!user || (link.roles && !link.roles.includes(user.user.role)))) {
                    return null;
                }

                const isActive = location.pathname === link.path;

                return (
                    <Link to={link.path} key={link.name} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItemButton sx={{
                            backgroundColor: isActive ? '#1abc9c' : 'transparent',
                            '&:hover': {
                                backgroundColor: '#16a085',
                                cursor: 'pointer'
                            },
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '12px',
                            marginBottom: '12px'
                        }}>
                            <ListItemIcon sx={{ color: '#ecf0f1' }}>
                                <FontAwesomeIcon icon={link.icon} size="lg" />
                            </ListItemIcon>
                            <div style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
                                {open && <ListItemText primary={t(`sidebar_${link.name.toLowerCase().replace(' ', '_')}`)} />}
                            </div>
                        </ListItemButton>
                    </Link>
                );
            })}
            {token && (
                <div style={{ marginTop: 'auto' }}>
                    <Divider sx={{ bgcolor: 'white' }} />
                    <ListItemButton onClick={handleLogout} sx={{
                        '&:hover': {
                            backgroundColor: '#16a085',
                            cursor: 'pointer',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '12px',
                    }}>
                        <ListItemIcon sx={{ color: '#ecf0f1' }}>
                            <ExitToAppIcon sx={{ fontSize: 24 }} />
                        </ListItemIcon>
                        <div style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
                            {open && <ListItemText primary={t('sidebar_logout')} />}
                        </div>
                    </ListItemButton>
                </div>
            )}
        </List>
    );
}