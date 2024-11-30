import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export const getSellerProfile = async (sellerId) => {
    try {
        const response = await fetch(`${API_URL}/users/${sellerId}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch seller profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching seller profile:', error);
        throw error;
    }
};

export const getSellerProducts = async (sellerId) => {
    try {
        const response = await fetch(`${API_URL}/users/${sellerId}/products/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch seller products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching seller products:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            if (key === 'profile_image' && userData[key].uri) {
                formData.append('profile_image', {
                    uri: userData[key].uri,
                    type: 'image/jpeg',
                    name: 'profile_image.jpg',
                });
            } else {
                formData.append(key, userData[key]);
            }
        });

        const response = await fetch(`${API_URL}/users/profile/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}; 