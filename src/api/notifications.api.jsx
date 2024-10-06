import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const getAllNotificationsByUser = (userId) => {
    return axiosInstance.get(`notifications?user=${userId}`);
}

export const updateNotification = (id, notificationData) => {
    return axiosInstance.patch(`notifications/${id}/`, notificationData);
}

export const deleteNotification = (id) => {
    return axiosInstance.delete(`notifications/${id}/`);
}