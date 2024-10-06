import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Token ${getToken()}`,
    }
});

export const getAllResources = () => {
    return axiosInstance.get("resources/");
}

export const getResource = (id) => {
    return axiosInstance.get(`resources/${id}/`);
}

export const getMyResources = (userId) => {
    return axiosInstance.get(`resources/?author=${userId}`);
}

export const createResource = (resourceData) => {
    return axiosInstance.post("resources/", resourceData);
}

export const updateResource = (id, resourceData) => {
    return axiosInstance.patch(`resources/${id}/`, resourceData);
}

export const deleteResource = (id) => {
    return axiosInstance.delete(`resources/${id}/`);
}