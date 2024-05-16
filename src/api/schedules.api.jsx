import axios from "axios";

export const getSchedule = (id) => {
    return axios.get(`http://127.0.0.1:8000/api/schedules/${id}/`)
}

export const getAllSchedules = () => {
    return axios.get("http://127.0.0.1:8000/api/schedules/")
}

export const getSchedulesByWorker = (workerId) => {
    return axios.get(`http://127.0.0.1:8000/api/schedules?worker=${workerId}`)
}

export const getSchedulesAvailablesByDate = (date, available = true) => {
    return axios.get(`http://127.0.0.1:8000/api/schedules?available=${available}&date=${date}`);
}