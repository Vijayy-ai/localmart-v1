import { API_URL } from './api';

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryProducts = async (categoryId, filters = {}) => {
    try {
        let url = `${API_URL}/categories/${categoryId}/products/`;
        const queryParams = new URLSearchParams(filters);
        
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching category products:', error);
        throw error;
    }
}; 