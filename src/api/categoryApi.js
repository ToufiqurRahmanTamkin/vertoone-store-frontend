import api from './axios';

export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
