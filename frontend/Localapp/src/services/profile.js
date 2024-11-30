import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export const updateProfile = async (profileData) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            if (key === 'profile_image' && profileData[key].uri) {
                formData.append('profile_image', {
                    uri: profileData[key].uri,
                    type: 'image/jpeg',
                    name: 'profile_image.jpg',
                });
            } else {
                formData.append(key, profileData[key]);
            }
        });

        const response = await fetch(`${API_URL}/users/update-profile/`, {
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

export const getUserStats = async () => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/users/stats/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}; 