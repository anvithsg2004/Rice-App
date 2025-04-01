// src/api/itemApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/rice-items';

export const getItemById = async (itemId) => {
    try {
        const response = await axios.get(`${API_URL}/${itemId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('Item not found');
        }
        throw new Error('Failed to fetch item details');
    }
};
