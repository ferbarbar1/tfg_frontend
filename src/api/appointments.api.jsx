import axios from "axios";

export const getAllAppointments = () => {
    return axios.get("https://tfgbackend-production.up.railway.app/api/appointments/")
}

export const getAppointment = (id) => {
    return axios.get(`https://tfgbackend-production.up.railway.app/api/appointments/${id}/`)
}

export const createAppointment = (appointmentData) => {
    return axios.post("https://tfgbackend-production.up.railway.app/api/appointments/", appointmentData)
}

export const updateAppointment = (id, appointmentData) => {
    return axios.patch(`https://tfgbackend-production.up.railway.app/api/appointments/${id}/`, appointmentData)
}

export const deleteAppointment = (id) => {
    return axios.delete(`https://tfgbackend-production.up.railway.app/api/appointments/${id}/`)
}