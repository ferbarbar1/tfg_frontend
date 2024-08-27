import axios from "axios";

export const getAllNotificationsByUser = (userId) => {
    return axios.get(`http://127.0.0.1:8000/api/notifications?user=${userId}`)
}

export const updateNotification = (id, notificationData) => {
    return axios.patch(`http://127.0.0.1:8000/api/notifications/${id}/`, notificationData)
}

export const deleteNotification = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/notifications/${id}/`)
}