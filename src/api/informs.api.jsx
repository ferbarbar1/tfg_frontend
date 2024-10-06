import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const getAllInforms = () => {
    return axiosInstance.get("informs/");
}

export const createInform = (informData) => {
    return axiosInstance.post("informs/", informData);
}

export const updateInform = (id, informData) => {
    return axiosInstance.patch(`informs/${id}/`, informData);
}