import React, { useContext, useState } from 'react';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Grid, IconButton, Paper, Tooltip, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NotificationsContext } from '../../contexts/NotificationsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { getConversationsByParticipants } from '../../api/conversations.api';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteNotification } from '../../api/notifications.api';
import { getUserByUsername } from '../../api/users.api';

export function NotificationsList() {
    const { notifications, toggleNotificationReadStatus, deleteNotificationFromState } = useContext(NotificationsContext);
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const notificationsPerPage = 5;
    const navigate = useNavigate();

    const handleToggleReadStatus = async (event, notificationId, isRead) => {
        event.stopPropagation();
        await toggleNotificationReadStatus(notificationId, !isRead);
    };

    const filterNotifications = () => {
        let filtered = notifications;

        if (filter === 'read') {
            filtered = notifications.filter(notification => notification.is_read);
        } else if (filter === 'unread') {
            filtered = notifications.filter(notification => !notification.is_read);
        }

        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    const handleNotificationClick = async (notification) => {
        const senderUsername = notification.message.match(/de (\w+)/)[1];
        const sender = await getUserByUsername(senderUsername);
        const senderId = sender.data[0].id;
        const participantIds = [user.user.id, senderId];
        const conversationsResponse = await getConversationsByParticipants(participantIds);
        if (conversationsResponse.data.length > 0) {
            const conversationId = conversationsResponse.data[0].id;
            navigate(`/chat/${conversationId}`);
        }
    };

    const filteredNotifications = filterNotifications();
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredNotifications.length / notificationsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDelete = async (event, notificationId) => {
        event.stopPropagation();
        try {
            await deleteNotification(notificationId);
            deleteNotificationFromState(notificationId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Box sx={{ mr: 3, ml: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                {filteredNotifications.length > 0 && (
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="unread">Unread</MenuItem>
                    </Select>
                )}
                <Tooltip title="Refresh notifications">
                    <IconButton onClick={handleRefresh} sx={{ ml: 2 }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {currentNotifications.length > 0 ? (
                currentNotifications.map((notification, index) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer'
                        }}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                    {notification.message}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888', marginTop: 1 }}>
                                    {new Date(notification.created_at).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} container justifyContent="flex-end">
                                <Tooltip title={notification.is_read ? "Mark as unread" : "Mark as read"}>
                                    <IconButton
                                        color="info"
                                        aria-label={notification.is_read ? "mark as unread" : "mark as read"}
                                        onClick={(event) => handleToggleReadStatus(event, notification.id, notification.is_read)}
                                    >
                                        {notification.is_read ? <MarkEmailReadIcon /> : <MarkunreadIcon />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        color="error"
                                        aria-label="delete"
                                        onClick={(event) => handleDelete(event, notification.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    No notifications to show.
                </Typography>
            )}
            {filteredNotifications.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredNotifications.length / notificationsPerPage)}>
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
}