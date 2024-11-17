import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

class ApiClient {
    async getHeaders() {
        const token = await AsyncStorage.getItem('access_token');
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async request(endpoint, options = {}) {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Request failed');
            }

            return await response.json();
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