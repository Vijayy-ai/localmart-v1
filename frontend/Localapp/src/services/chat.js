import { apiClient } from './api';

export const getChats = async () => {
    try {
        return await apiClient.get('/chat/rooms/');
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to view chats');
        }
        throw error;
    }
};

export const getChatMessages = async (chatId) => {
    try {
        return await apiClient.get(`/chat/rooms/${chatId}/messages/`);
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to view messages');
        }
        throw error;
    }
};

export const createOrGetChatRoom = async (productId, sellerId) => {
    try {
        return await apiClient.post('/chat/rooms/create/', {
            product_id: productId,
            seller_id: sellerId
        });
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to start a chat');
        }
        throw error;
    }
};

export const markChatAsRead = async (chatId) => {
    try {
        return await apiClient.post(`/chat/rooms/${chatId}/mark-read/`);
    } catch (error) {
        if (error.message === 'Authentication required') {
            throw new Error('Please login to mark chat as read');
        }
        throw error;
    }
};

export const getUnreadCount = async (chatId) => {
    try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/chat/rooms/${chatId}/unread_count/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get unread count');
        }

        const data = await response.json();
        return data.unread_count;
    } catch (error) {
        console.error('Error getting unread count:', error);
        throw error;
    }
}; 