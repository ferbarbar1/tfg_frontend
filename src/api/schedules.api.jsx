import axios from "axios";

export const getSchedule = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/schedules/${id}/`)
}