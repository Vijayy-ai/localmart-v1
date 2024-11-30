import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export const apiClient = {
    post: async (endpoint, data) => {
        try {
            const isAuthEndpoint = endpoint.includes('/auth/') || 
                                 endpoint.includes('/users/login') || 
                                 endpoint.includes('/users/register');
            
            const fullUrl = `${API_URL}${endpoint}`;
            console.log('Making request to:', fullUrl);
            console.log('Request data:', data);
            
            // Check if data is FormData
            const isFormData = data instanceof FormData;
            
            const headers = {
                'Accept': 'application/json',
                // Only set Content-Type for non-FormData requests
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            };

            // Add Authorization header for non-auth endpoints
            if (!isAuthEndpoint) {
                const token = await AsyncStorage.getItem('access_token');
                if (token) {
                    headers['Authorization'] = token;
                }
            }

            const response = await fetch(fullUrl, {
                method: 'POST',
                headers,
                // Don't stringify if it's FormData
                body: isFormData ? data : JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);
            
            if (!response.ok) {
                throw new Error(responseData.error || responseData.detail || 'Request failed');
            }

            return responseData;
        } catch (error) {
            console.error('API Request failed:', error);
            if (error.message === 'Network request failed') {
                throw new Error('Cannot connect to server. Please check your internet connection and server status.');
            }
            throw error;
        }
    },

    get: async (endpoint) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = token;
            }

            const fullUrl = `${API_URL}${endpoint}`;
            console.log('Making GET request to:', fullUrl);

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers
            });

            const data = await response.json();
            console.log('GET Response:', data);
            
            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
}; 