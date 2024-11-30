import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.listeners = new Map();
    }

    async connect(chatId) {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) throw new Error('No authentication token');

            const wsUrl = API_URL.replace('http', 'ws');
            this.ws = new WebSocket(`${wsUrl}/ws/chat/${chatId}/?token=${token}`);

            this.ws.onopen = () => {
                console.log('WebSocket Connected');
                this.reconnectAttempts = 0;
            };

            this.ws.onclose = () => {
                console.log('WebSocket Disconnected');
                this.handleReconnect(chatId);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.notifyListeners(data);
            };
        } catch (error) {
            console.error('WebSocket Connection Error:', error);
            throw error;
        }
    }

    handleReconnect(chatId) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.connect(chatId);
            }, 1000 * Math.pow(2, this.reconnectAttempts));
        }
    }

    addListener(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
    }

    removeListener(type, callback) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).delete(callback);
        }
    }

    notifyListeners(data) {
        const listeners = this.listeners.get(data.type);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not connected');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export default new WebSocketManager(); 