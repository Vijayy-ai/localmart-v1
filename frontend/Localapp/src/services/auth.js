import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

export const register = async (userData) => {
    try {
        console.log('Attempting registration...', userData);
        
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                phone_number: userData.phone || '',
                location: userData.address || ''
            })
        });

        const data = await response.json();
        console.log('Registration response:', data);
        
        if (!response.ok) {
            throw new Error(data.error || data.detail || 'Registration failed');
        }

        if (data.access_token) {
            const token = `Bearer ${data.access_token}`;
            await Promise.all([
                AsyncStorage.setItem('access_token', token),
                data.user ? AsyncStorage.setItem('user_data', JSON.stringify(data.user)) : null
            ].filter(Boolean));
        }

        return data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        console.log('Attempting login with:', { email, password });
        
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data);
        
        if (!response.ok) {
            throw new Error(data.error || data.detail || 'Invalid credentials');
        }

        if (data?.access_token) {
            const token = `Bearer ${data.access_token}`;
            console.log('Storing token:', token);
            
            await Promise.all([
                AsyncStorage.setItem('access_token', token),
                data.user ? AsyncStorage.setItem('user_data', JSON.stringify(data.user)) : null
            ].filter(Boolean));
            
            return data;
        } else {
            throw new Error('Invalid response format: missing access token');
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.multiRemove(['access_token', 'user_data']);
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export const isAuthenticated = async () => {
    try {
        const [token, userData] = await Promise.all([
            AsyncStorage.getItem('access_token'),
            AsyncStorage.getItem('user_data')
        ]);
        return !!(token && userData);
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

export const getCurrentUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}; 