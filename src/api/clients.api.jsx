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

export const getAllClients = () => {
    return axiosInstance.get("clients/");
}

export const getClient = (id) => {
    return axiosInstance.get(`clients/${id}/`);
}

export const createClient = (clientData) => {
    return axiosInstance.post("clients/", clientData);
}

export const updateClient = (id, clientData) => {
    return axiosInstance.patch(`clients/${id}/`, clientData);
}

export const deleteClient = (id) => {
    return axiosInstance.delete(`clients/${id}/`);
}