import { apiClient } from './api';
import { API_URL } from '../config/api';

export const createProduct = async (productData) => {
    try {
        const formData = new FormData();
        
        // Append text fields
        Object.keys(productData).forEach(key => {
            if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, String(productData[key]));
            }
        });

        // Append images
        if (productData.images?.length > 0) {
            productData.images.forEach((image, index) => {
                const imageUri = image.uri;
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('images', {
                    uri: imageUri,
                    type,
                    name: filename || `image${index}.jpg`
                });
            });
        }

        return await apiClient.post('/products/', formData);
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.message === 'Authentication required') {
            throw new Error('Please login to create a product');
        }
        throw error;
    }
};

export const getProducts = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams(
            Object.entries(filters).filter(([_, value]) => value)
        ).toString();
        
        const endpoint = `/products/${queryParams ? `?${queryParams}` : ''}`;
        const response = await apiClient.get(endpoint);
        
        // Format the products data
        const products = Array.isArray(response) ? response : response.results || [];
        return products.map(product => ({
            ...product,
            images: product.images?.map(img => ({
                ...img,
                uri: img.image || img.uri,
                // Handle both relative and absolute URLs
                image: img.image?.startsWith('http') 
                    ? img.image 
                    : `${API_URL}${img.image}`
            })) || []
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getMyListings = async () => {
    try {
        const products = await apiClient.get('/products/my/');
        return products.map(product => ({
            ...product,
            images: product.images.map(img => ({
                ...img,
                uri: img.image.startsWith('http') ? img.image : `${API_URL}${img.image}`
            }))
        }));
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to view your listings');
        }
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/products/${productId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const getWishlist = async () => {
    try {
        return await apiClient.get('/products/wishlist/');
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to view your wishlist');
        }
        throw error;
    }
};

export const toggleWishlist = async (productId) => {
    try {
        const response = await apiClient.post(`/products/${productId}/wishlist/toggle/`);
        return response;
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        throw error;
    }
};

export const getProductDetails = async (productId) => {
    try {
        const response = await apiClient.get(`/products/${productId}/`);
        if (!response) {
            throw new Error('No data received from server');
        }
        return response;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
}; 