import axios from "axios";

export const getAllWorkers = () => {
    return axios.get("http://127.0.0.1:8000/api/workers/")
}

export const getWorker = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/workers/${id}/`)
}

export const createWorker = (workerData) => {
    return axios.post("http://127.0.0.1:8000/api/workers/", workerData)
}

export const updateWorker = (id, workerData) => {
    return axios.patch(`http://127.0.0.1:8000/api/workers/${id}/`, workerData)
}

export const deleteWorker = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/workers/${id}/`)
}