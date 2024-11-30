import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/auth';
import { API_URL } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    const checkTokenValidity = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                setUser(null);
                setToken(null);
                return;
            }

            // Make a test request to verify token
            const response = await fetch(`${API_URL}/users/verify-token/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // Token is invalid or expired
                await logout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            await logout();
        }
    };

    useEffect(() => {
        loadStoredAuth();
        // Check token validity periodically
        const interval = setInterval(checkTokenValidity, 5 * 60 * 1000); // Every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const loadStoredAuth = async () => {
        try {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem('access_token'),
                AsyncStorage.getItem('user')
            ]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            setError('Failed to load authentication state');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(username, password);
            
            await Promise.all([
                AsyncStorage.setItem('access_token', response.token),
                AsyncStorage.setItem('user', JSON.stringify(response.user))
            ]);

            setUser(response.user);
            setToken(response.token);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await Promise.all([
                AsyncStorage.removeItem('access_token'),
                AsyncStorage.removeItem('user')
            ]);
            setUser(null);
            setToken(null);
        } catch (error) {
            setError('Failed to logout');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            const updatedUser = await authService.updateProfile(profileData);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            setError('Failed to update profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            login,
            register,
            logout,
            updateProfile,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 