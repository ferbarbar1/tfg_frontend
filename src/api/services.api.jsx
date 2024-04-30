import axios from "axios";

export const getAllServices = () => {
    return axios.get("http://127.0.0.1:8000/api/services/")
}

export const getService = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/services/${id}/`)
}

export const createService = (serviceData) => {
    return axios.post("http://127.0.0.1:8000/api/services/", serviceData)
}

export const updateService = (id, serviceData) => {
    return axios.put(`http://127.0.0.1:8000/api/services/${id}/`, serviceData)
}

export const deleteService = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/services/${id}/`)
}