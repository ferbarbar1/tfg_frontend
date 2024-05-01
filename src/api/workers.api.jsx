import axios from "axios";

export const getAllWorkers = () => {
    return axios.get("https://tfgbackend-production.up.railway.app/api/workers/")
}

export const getWorker = (id) => {
    return axios.get(`https://tfgbackend-production.up.railway.app/api/workers/${id}/`)
}

export const createWorker = (workerData) => {
    return axios.post("https://tfgbackend-production.up.railway.app/api/workers/", workerData)
}

export const updateWorker = (id, workerData) => {
    return axios.patch(`https://tfgbackend-production.up.railway.app/api/workers/${id}/`, workerData)
}

export const deleteWorker = (id) => {
    return axios.delete(`https://tfgbackend-production.up.railway.app/api/workers/${id}/`)
}