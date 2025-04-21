// api.js
import axios from 'axios';

export const API_BASE_URL = 'https://rice-app-kl2g.onrender.com/api';

// Create a clean axios instance without auth headers
const plainAxios = axios.create();

// Modified apiCall function
export const apiCall = async (method, url, data = null) => {
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Basic ${token}` } : {};

    try {
        const response = await plainAxios({
            method,
            url: `${API_BASE_URL}${url}`,
            data,
            headers
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        throw error;
    }
};
