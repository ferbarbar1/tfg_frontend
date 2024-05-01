import axios from 'axios';

export const getUserData = async (token) => {
    const response = await axios.get('https://tfgbackend-production.up.railway.app/api/profile', {
        headers: {
            'Authorization': `Token ${token}`
        }
    });

    return response.data;
};