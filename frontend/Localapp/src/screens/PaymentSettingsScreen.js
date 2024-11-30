import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentSettingsScreen() {
    const [loading, setLoading] = useState(false);

    const handleAddPayment = () => {
        Alert.alert('Coming Soon', 'Payment integration will be available soon!');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddPayment}
                >
                    <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                    <Text style={styles.addButtonText}>Add Payment Method</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About Payments</Text>
                <Text style={styles.infoText}>
                    Securely manage your payment methods and transactions. 
                    Add multiple payment options to make buying and selling easier.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: 'white',
        marginTop: 20,
        padding: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    addButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#007AFF',
    },
    infoSection: {
        padding: 20,
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
}); 