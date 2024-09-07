import axios from "axios";


export const getAllAppointments = () => {
    return axios.get("http://127.0.0.1:8000/api/appointments/")
}

export const getAppointment = (appointmentId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`)
}

export const createAppointment = (appointmentData) => {
    return axios.post("http://127.0.0.1:8000/api/appointments/", appointmentData)
}

export const updateAppointment = (appointmentId, appointmentData) => {
    return axios.patch(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`, appointmentData)
}

export const deleteAppointment = (appointmentId) => {
    return axios.delete(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`)
}

export const getAppointmentsByWorker = (workerId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments?worker=${workerId}`)
}

export const getAppointmentsByClient = (clientId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments?client=${clientId}`)
}

export const getAppointmentsByService = (serviceId) => {
    return axios.get(`http://127.0.0.1:8000/api/appointments?service=${serviceId}`)
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

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/appointments/cancel/', { appointment_id: appointmentId });
        return response.data;
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
};