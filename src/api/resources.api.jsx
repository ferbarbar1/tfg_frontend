import axios from "axios";

export const getAllResources = () => {
    return axios.get("http://127.0.0.1:8000/api/resources/")
}

export const getResource = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/resources/${id}/`)
}

export const getMyResources = (userId) => {
    return axios.get(`http://127.0.0.1:8000/api/resources/?author=${userId}`)
}

export const createResource = (resourceData) => {
    return axios.post("http://127.0.0.1:8000/api/resources/", resourceData)
}

export const updateResource = (id, resourceData) => {
    return axios.patch(`http://127.0.0.1:8000/api/resources/${id}/`, resourceData)
}

export const deleteResource = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/resources/${id}/`)
}