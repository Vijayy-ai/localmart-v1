import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const initializeNotifications = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            throw new Error('Permission not granted for notifications');
        }

        const token = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem('pushToken', token.data);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    } catch (error) {
        console.error('Error setting up notifications:', error);
        return null;
    }
};

export const handleNotification = async (notification) => {
    const { data } = notification;

    switch (data.type) {
        case 'message':
            return {
                title: `New message from ${data.senderName}`,
                body: data.message,
                data: { screen: 'Chat', params: { chatId: data.chatId } }
            };
        case 'order':
            return {
                title: 'New Order',
                body: `You have a new order for ${data.productTitle}`,
                data: { screen: 'OrderDetails', params: { orderId: data.orderId } }
            };
        default:
            return null;
    }
};

export const scheduleLocalNotification = async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
        },
        trigger: null,
    });
}; 