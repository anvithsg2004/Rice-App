import { apiCall } from './api';

export const getAllCategories = async () => {
    return apiCall('get', '/categories');
};

export const getCategoryByName = async (name) => {
    return apiCall('get', `/categories/${name}`);
};
