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


export const getAllInforms = () => {
    return axiosInstance.get("informs/");
}

export const createInform = (informData) => {
    return axiosInstance.post("informs/", informData);
}

export const updateInform = (id, informData) => {
    return axiosInstance.patch(`informs/${id}/`, informData);
}