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

export const getSchedule = (id) => {
    return axiosInstance.get(`schedules/${id}/`);
}

export const getAllSchedules = () => {
    return axiosInstance.get("schedules/");
}

export const getSchedulesByWorker = (workerId) => {
    return axiosInstance.get(`schedules?worker=${workerId}`);
}

export const getSchedulesAvailablesByDate = (date, available = true) => {
    return axiosInstance.get(`schedules?available=${available}&date=${date}`);
}