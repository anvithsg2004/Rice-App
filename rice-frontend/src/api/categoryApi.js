import axios from 'axios';
import { API_BASE_URL } from './apiConfig'; // Ensure correct import path

export const getAllCategories = async () => {
    try {
        console.log('Fetching all categories from:', `${API_BASE_URL}/categories`); // Debugging line
        const response = await axios.get(`${API_BASE_URL}/categories`);
        console.log('Response from server:', response.data); // Debugging line
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryByName = async (name) => {
    try {
        console.log('Fetching category by name:', name); // Debugging line
        const response = await axios.get(`${API_BASE_URL}/categories/${name}`);
        console.log('Response from server:', response.data); // Debugging line
        return response.data;
    } catch (error) {
        console.error('Error fetching category by name:', error);
        throw error;
    }
};
