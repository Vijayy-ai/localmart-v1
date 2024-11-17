import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                {user?.phone && <Text style={styles.detail}>📱 {user.phone}</Text>}
                {user?.address && <Text style={styles.detail}>📍 {user.address}</Text>}
            </View>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.buttonText}>Add New Product</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileInfo: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
}); 