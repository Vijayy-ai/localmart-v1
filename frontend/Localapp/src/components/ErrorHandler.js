import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ErrorView = ({ message, onRetry }) => (
    <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>{message}</Text>
        {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
        )}
    </View>
);

export const handleError = (error, showAlert = true) => {
    console.error('Error:', error);
    if (showAlert) {
        Alert.alert(
            'Error',
            error.message || 'An unexpected error occurred',
            [{ text: 'OK' }]
        );
    }
    return error.message || 'An unexpected error occurred';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
}); 