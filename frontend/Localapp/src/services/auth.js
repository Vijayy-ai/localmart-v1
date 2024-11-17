import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export const login = async (username, password) => {
    console.log('Attempting login to:', `${API_URL}/users/login/`);
    
    const response = await fetch(`${API_URL}/users/login/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    
    // Store the token
    await AsyncStorage.setItem('access_token', data.token);
    return data;
};

export const register = async (userData) => {
    console.log('Attempting registration to:', `${API_URL}/users/register/`);
    
    const response = await fetch(`${API_URL}/users/register/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }
    
    return data;
};

export const logout = async () => {
    try {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const getAuthState = async () => {
    try {
        const [[, accessToken], [, userData]] = await AsyncStorage.multiGet([
            'access_token',
            'user_data'
        ]);
        return {
            token: accessToken,
            user: userData ? JSON.parse(userData) : null,
            isAuthenticated: !!accessToken
        };
    } catch (error) {
        console.error('Error getting auth state:', error);
        return { token: null, user: null, isAuthenticated: false };
    }
}; 