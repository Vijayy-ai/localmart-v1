import { API_URL } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProducts = async (filters = {}) => {
    try {
        let url = `${API_URL}/products/`;
        const params = new URLSearchParams();
        
        // Add filters to query params
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/products/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const uploadProductImage = async (productId, imageUri, isPrimary = false) => {
    try {
        const user = await AsyncStorage.getItem('user');
        const { token } = JSON.parse(user);
        
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'product_image.jpg',
        });
        formData.append('is_primary', isPrimary);
        
        const response = await fetch(`${API_URL}/products/${productId}/upload_image/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to upload image');
        
        return await response.json();
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}; 