import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';


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

export const getAppointmentsByWorker = (workerId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments?worker=${workerId}`)
}

export const getAppointmentsByClient = (clientId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments?client=${clientId}`)
}

export const createCheckoutSession = async (serviceId, clientId, scheduleId, description, modality) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/payments/checkout-session/", {
            service_id: serviceId,
            client_id: clientId,
            schedule_id: scheduleId,
            description: description,
            modality: modality
        });
        return response.data.sessionId;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};