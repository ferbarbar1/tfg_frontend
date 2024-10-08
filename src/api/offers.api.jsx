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

export const getAllOffers = () => {
    return axiosInstance.get("offers/");
}

export const getOffer = (id) => {
    return axiosInstance.get(`offers/${id}/`);
}

export const createOffer = (offerData) => {
    return axiosInstance.post("offers/", offerData);
}

export const updateOffer = (id, offerData) => {
    return axiosInstance.patch(`offers/${id}/`, offerData);
}

export const deleteOffer = (id) => {
    return axiosInstance.delete(`offers/${id}/`);
}