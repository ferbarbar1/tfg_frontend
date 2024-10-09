import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllNotificationsByUser, updateNotification } from '../api/notifications.api';
import { AuthContext } from '../contexts/AuthContext';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchNotifications() {
            if (user && user.user) {
                try {
                    const response = await getAllNotificationsByUser(user.user.id);
                    setNotifications(response.data);
                } catch (error) {
                    console.error("Error fetching notifications: ", error);
                }
            }
        }
        fetchNotifications();
    }, [user]);

    const toggleNotificationReadStatus = async (notificationId, isRead) => {
        try {
            await updateNotification(notificationId, { is_read: isRead });
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: isRead }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error updating notification status: ", error);
        }
    };

    const deleteNotificationFromState = (notificationId) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== notificationId)
        );
    };

    const unreadMessageCount = notifications.filter(notification => !notification.is_read && notification.type === 'message').length;

    return (
        <NotificationsContext.Provider value={{ notifications, toggleNotificationReadStatus, deleteNotificationFromState, unreadMessageCount }}>
            {children}
        </NotificationsContext.Provider>
    );
};