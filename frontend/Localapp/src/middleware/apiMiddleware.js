import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/api';

export const apiMiddleware = async (endpoint, options = {}) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        // Handle token expiration
        if (response.status === 401) {
            await AsyncStorage.removeItem('access_token');
            throw new Error('Session expired. Please login again.');
        }

        // Handle other error responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 