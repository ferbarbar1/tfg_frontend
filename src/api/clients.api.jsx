import axios from "axios";

export const getAllClients = () => {
    return axios.get("http://127.0.0.1:8000/api/clients/")
}

export const getClient = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/clients/${id}/`)
}

export const createClient = (clientData) => {
    return axios.post("http://127.0.0.1:8000/api/clients/", clientData)
}

export const updateClient = (id, clientData) => {
    return axios.patch(`http://127.0.0.1:8000/api/clients/${id}/`, clientData)
}

export const deleteClient = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/clients/${id}/`)
}