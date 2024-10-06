import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

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