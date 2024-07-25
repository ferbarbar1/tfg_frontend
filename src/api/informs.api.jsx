import axios from "axios";

export const getAllInforms = () => {
    return axios.get("http://127.0.0.1:8000/api/informs/")
}

export const createInform = (informData) => {
    return axios.post("http://127.0.0.1:8000/api/informs/", informData);
}

export const updateInform = (id, informData) => {
    return axios.patch(`http://127.0.0.1:8000/api/informs/${id}/`, informData);
}