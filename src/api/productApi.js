import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const searchProducts = (query) => api.get('/products/search', { params: { q: query } });
