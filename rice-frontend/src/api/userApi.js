import { apiCall } from './api';

const userId = localStorage.getItem('userId');
//'http://localhost:8080/api'

export const fetchUser = async () => {
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    return apiCall('get', `/email/${userEmail}`);
};

export const updateUser = async (userData) => {
    return apiCall('put', `/${userId}`, userData);
};

export const addUPI = async (upi) => {
    const token = localStorage.getItem('authToken');
    return apiCall('post', `/${userId}/add-upi`, upi, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const removeUPI = async (upi) => {
    return apiCall('delete', `/${userId}/remove-upi`, { upi });
};

export const addPaymentMethod = async (paymentMethod) => {
    return apiCall('post', `/${userId}/add-payment-method`, paymentMethod);
};

export const removePaymentMethod = async (paymentMethod) => {
    return apiCall('delete', `/${userId}/remove-payment-method`, paymentMethod);
};

export const deleteUser = async () => {
    return apiCall('delete', `/${userId}`);
};
