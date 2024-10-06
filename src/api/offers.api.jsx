import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Token ${getToken()}`,
    }
});

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