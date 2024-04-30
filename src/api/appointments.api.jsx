import axios from "axios";

export const getAllAppointments = () => {
    return axios.get("http://127.0.0.1:8000/api/appointments/")
}

export const getAppointment = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments/${id}/`)
}

export const createAppointment = (appointmentData) => {
    return axios.post("http://127.0.0.1:8000/api/appointments/", appointmentData)
}

export const updateAppointment = (id, appointmentData) => {
    return axios.patch(`http://127.0.0.1:8000/api/appointments/${id}/`, appointmentData)
}

export const deleteAppointment = (id) => {
    return axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`)
}