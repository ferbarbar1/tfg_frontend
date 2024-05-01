import axios from "axios";

export const getAllClients = () => {
    return axios.get("https://tfgbackend-production.up.railway.app/api/clients/")
}

export const getClient = (id) => {
    return axios.get(`https://tfgbackend-production.up.railway.app/api/clients/${id}/`)
}

export const createClient = (clientData) => {
    return axios.post("https://tfgbackend-production.up.railway.app/api/clients/", clientData)
}

export const updateClient = (id, clientData) => {
    return axios.patch(`https://tfgbackend-production.up.railway.app/api/clients/${id}/`, clientData)
}

export const deleteClient = (id) => {
    return axios.delete(`https://tfgbackend-production.up.railway.app/api/clients/${id}/`)
}