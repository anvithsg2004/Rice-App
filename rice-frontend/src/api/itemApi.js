import { apiCall } from './api';

export const getItemById = async (itemId) => {
    return apiCall('get', `/rice-items/${itemId}`);
};
