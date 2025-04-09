import { apiCall } from './api';

export const addItem = async (itemData) => {
    return apiCall('post', '/rice-items', itemData);
};
