import axios from "axios";

export const getAllOffers = () => {
    return axios.get("http://127.0.0.1:8000/api/offers/")
}

export const getOffer = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/offers/${id}/`)
}

export const createOffer = (offerData) => {
    return axios.post("http://127.0.0.1:8000/api/offers/", offerData)
}

export const updateOffer = (id, offerData) => {
    return axios.patch(`http://127.0.0.1:8000/api/offers/${id}/`, offerData)
}

export const deleteOffer = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/offers/${id}/`)
}