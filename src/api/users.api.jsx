import axios from 'axios';

export const getUserByUsername = async (username) => {
    return axios.get(`http://127.0.0.1:8000/api/users?username=${username}`);
}

export const getUserById = async (id) => {
    return axios.get(`http://127.0.0.1:8000/api/users/?id=${id}`);
}

export const loginUser = async (username, password, userType) => {
    const response = await axios.post(`http://127.0.0.1:8000/api/login/${userType}/`, {
        username,
        password,
    });

    return response.data.token;
};

export const getUserData = async (token) => {
    const response = await axios.get('http://127.0.0.1:8000/api/profile', {
        headers: {
            'Authorization': `Token ${token}`
        }
    });

    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(
        "http://127.0.0.1:8000/api/register/client/",
        userData
    );
    return response.data;
};