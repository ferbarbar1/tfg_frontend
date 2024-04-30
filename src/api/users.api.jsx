import axios from 'axios';

export const getUserData = async (token) => {
    const response = await axios.get('http://127.0.0.1:8000/api/profile', {
        headers: {
            'Authorization': `Token ${token}`
        }
    });

    return response.data;
};