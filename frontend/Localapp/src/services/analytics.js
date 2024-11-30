import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export const getAnalytics = async (timeframe = 'week') => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/products/analytics/?timeframe=${timeframe}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch analytics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
};

export const getProductAnalytics = async (productId) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/products/${productId}/analytics/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product analytics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching product analytics:', error);
        throw error;
    }
}; 