import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const HARD_CODED_USER_ID = '67eab2c61b0da34e6373a804';

export const fetchUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUser = async (updatedUserData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}`, updatedUserData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const addUPI = async (upi) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}/add-upi`, { upi });
        return response.data;
    } catch (error) {
        console.error('Error adding UPI:', error);
        throw error;
    }
};

export const removeUPI = async (upi) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}/remove-upi`, {
            data: { upi }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing UPI:', error);
        throw error;
    }
};

export const addPaymentMethod = async (paymentMethod) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}/add-payment-method`, paymentMethod);
        return response.data;
    } catch (error) {
        console.error('Error adding payment method:', error);
        throw error;
    }
};

export const removePaymentMethod = async (paymentMethod) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}/remove-payment-method`, {
            data: paymentMethod
        });
        return response.data;
    } catch (error) {
        console.error('Error removing payment method:', error);
        throw error;
    }
};

export const deleteUser = async () => {
    try {
        await axios.delete(`${API_BASE_URL}/users/${HARD_CODED_USER_ID}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
