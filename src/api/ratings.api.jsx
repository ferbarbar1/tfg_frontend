import axios from "axios";

export const getAllRatings = () => {
    return axios.get("https://tfgbackend-production.up.railway.app/api/ratings/")
}