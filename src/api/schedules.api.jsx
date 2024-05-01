import axios from "axios";

export const getSchedule = (id) => {
    return axios.get(`https://tfgbackend-production.up.railway.app/api/schedules/${id}/`)
}