import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getAllRatings = () => {
    return axiosInstance.get("ratings/");
}

export const getRatingByAppointment = (appointmentId) => {
    return axiosInstance.get(`ratings?appointment=${appointmentId}`);
}

export const createRating = (ratingData) => {
    return axiosInstance.post("ratings/", ratingData);
}

export const updateRating = (id, ratingData) => {
    return axiosInstance.patch(`ratings/${id}/`, ratingData);
}