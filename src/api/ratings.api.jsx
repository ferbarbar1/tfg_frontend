import axios from "axios";

export const getAllRatings = () => {
    return axios.get("http://127.0.0.1:8000/api/ratings/")
}

export const getRatingsByService = (serviceId) => {
    return axios.get(`http://127.0.0.1:8000/api/ratings?service=${serviceId}`);
}

export const createRating = (ratingData) => {
    return axios.post("http://127.0.0.1:8000/api/ratings/", ratingData);
}
