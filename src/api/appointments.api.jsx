import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const getAllAppointments = () => {
    return axiosInstance.get("appointments/");
}

export const getAppointment = (appointmentId) => {
    return axiosInstance.get(`appointments/${appointmentId}/`);
}

export const createAppointment = (appointmentData) => {
    return axiosInstance.post("appointments/", appointmentData);
}

export const updateAppointment = (appointmentId, appointmentData) => {
    return axiosInstance.patch(`appointments/${appointmentId}/`, appointmentData);
}

export const deleteAppointment = (appointmentId) => {
    return axiosInstance.delete(`appointments/${appointmentId}/`);
}

export const getAppointmentsByWorker = (workerId) => {
    return axiosInstance.get(`appointments?worker=${workerId}`);
}

export const getAppointmentsByClient = (clientId) => {
    return axiosInstance.get(`appointments?client=${clientId}`);
}

export const getAppointmentsByService = (serviceId) => {
    return axiosInstance.get(`appointments?service=${serviceId}`);
}

export const getAppointmentsByWorkerAndService = (serviceId, workerId) => {
    return axiosInstance.get(`appointments?service=${serviceId}&worker=${workerId}`);
}

export const createCheckoutSession = async (serviceId, clientId, scheduleId, description, modality) => {
    try {
        const response = await axiosInstance.post("payments/checkout-session/", {
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
        const response = await axiosInstance.post('appointments/cancel/', { appointment_id: appointmentId });
        return response.data;
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
};

export const createAppointmentByOwner = async (serviceId, clientId, scheduleId, description, modality) => {
    try {
        const response = await axiosInstance.post('create-appointment-by-owner/', {
            service_id: serviceId,
            client_id: clientId,
            schedule_id: scheduleId,
            description: description,
            modality: modality
        });
        return response.data;
    } catch (error) {
        console.error('Error creating appointment by owner:', error);
        throw error;
    }
}
