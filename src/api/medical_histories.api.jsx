import axios from "axios";

export const getAllMedicalHistories = () => {
    return axios.get("http://127.0.0.1:8000/api/medical-histories/")
}

export const getAllMedicalHistoriesByClient = (clientId) => {
    return axios.get(`http://127.0.0.1:8000/api/medical-histories?client=${clientId}`)
}

export const createMedicalHistory = (medicalHistoryData) => {
    return axios.post("http://127.0.0.1:8000/api/medical-histories/", medicalHistoryData)
}

export const deleteMedicalHistory = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/medical-histories/${id}/`)
}