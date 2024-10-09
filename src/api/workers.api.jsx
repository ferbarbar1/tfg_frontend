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


export const getAllWorkers = () => {
    return axiosInstance.get("workers/");
}

export const getWorker = (id) => {
    return axiosInstance.get(`workers/${id}/`);
}

export const createWorker = (workerData) => {
    return axiosInstance.post("workers/", workerData);
}

export const updateWorker = (id, workerData) => {
    return axiosInstance.patch(`workers/${id}/`, workerData);
}

export const deleteWorker = (id) => {
    return axiosInstance.delete(`workers/${id}/`);
}