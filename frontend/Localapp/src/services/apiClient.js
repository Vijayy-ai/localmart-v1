import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

class ApiClient {
    async getHeaders(isFormData = false) {
        const token = await AsyncStorage.getItem('access_token');
        return {
            'Accept': 'application/json',
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { 'Authorization': token } : {})
        };
    }

    async request(endpoint, options = {}) {
        try {
            const isFormData = options.body instanceof FormData;
            const headers = await this.getHeaders(isFormData);
            
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

export default new ApiClient(); 