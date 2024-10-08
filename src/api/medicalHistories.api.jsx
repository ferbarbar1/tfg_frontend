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

export const getMedicalHistory = (id) => {
    return axiosInstance.get(`medical-histories/${id}/`);
}

export const getAllMedicalHistories = () => {
    return axiosInstance.get("medical-histories/");
}

export const getAllMedicalHistoriesByClient = (clientId) => {
    return axiosInstance.get(`medical-histories?client=${clientId}`);
}

export const createMedicalHistory = (medicalHistoryData) => {
    return axiosInstance.post("medical-histories/", medicalHistoryData);
}

export const updateMedicalHistory = (id, medicalHistoryData) => {
    return axiosInstance.put(`medical-histories/${id}/`, medicalHistoryData);
}

export const deleteMedicalHistory = (id) => {
    return axiosInstance.delete(`medical-histories/${id}/`);
}