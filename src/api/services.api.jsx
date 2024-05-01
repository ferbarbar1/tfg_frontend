import axios from "axios";

export const getAllServices = () => {
    return axios.get("https://tfgbackend-production.up.railway.app/api/services/")
}

export const getService = (id) => {
    return axios.get(`https://tfgbackend-production.up.railway.app/api/services/${id}/`)
}

export const createService = (serviceData) => {
    return axios.post("https://tfgbackend-production.up.railway.app/api/services/", serviceData)
}

export const updateService = (id, serviceData) => {
    return axios.put(`https://tfgbackend-production.up.railway.app/api/services/${id}/`, serviceData)
}

export const deleteService = (id) => {
    return axios.delete(`https://tfgbackend-production.up.railway.app/api/services/${id}/`)
}