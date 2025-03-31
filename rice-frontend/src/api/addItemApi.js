import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

// Add a new rice item
export const addItem = async (itemData) => {
    try {
        console.log('Adding item with data:', itemData); // Debugging line
        const response = await axios.post(`${API_BASE_URL}/rice-items`, itemData);
        console.log('Response from server:', response); // Debugging line
        return response; // Return the entire response object
    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
};

// Get all rice items
export const getAllItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rice-items`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rice items:', error);
        throw error;
    }
};

// Get rice items by type
export const getItemsByType = async (type) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rice-items/type/${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rice items by type:', error);
        throw error;
    }
};

// Get rice items by in-stock status
export const getItemsByInStock = async (inStock) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rice-items/in-stock/${inStock}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rice items by in-stock status:', error);
        throw error;
    }
};

// Update rice item
export const updateItem = async (itemId, updatedItem) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/rice-items/${itemId}`, updatedItem);
        return response.data;
    } catch (error) {
        console.error('Error updating rice item:', error);
        throw error;
    }
};

// Delete rice item
export const deleteItem = async (itemId) => {
    try {
        await axios.delete(`${API_BASE_URL}/rice-items/${itemId}`);
    } catch (error) {
        console.error('Error deleting rice item:', error);
        throw error;
    }
};
