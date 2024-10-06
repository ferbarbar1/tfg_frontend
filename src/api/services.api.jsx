import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Token ${getToken()}`,
    }
});

export const getAllServices = () => {
    return axiosInstance.get("services/");
}

export const getService = (id) => {
    return axiosInstance.get(`services/${id}/`);
}

export const createService = (serviceData) => {
    return axiosInstance.post("services/", serviceData);
}

export const updateService = (id, serviceData) => {
    return axiosInstance.put(`services/${id}/`, serviceData);
}

export const deleteService = (id) => {
    return axiosInstance.delete(`services/${id}/`);
}