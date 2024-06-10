import axios from "axios";

export const getAllRatings = () => {
    return axios.get("http://127.0.0.1:8000/api/ratings/")
}

export const getRatingByAppointment = (appointmentId) => {
    return axios.get(`http://127.0.0.1:8000/api/ratings?appointment=${appointmentId}`);
}

export const createRating = (ratingData) => {
    return axios.post("http://127.0.0.1:8000/api/ratings/", ratingData);
}

export const updateRating = (id, ratingData) => {
    return axios.patch(`http://127.0.0.1:8000/api/ratings/${id}/`, ratingData);
}