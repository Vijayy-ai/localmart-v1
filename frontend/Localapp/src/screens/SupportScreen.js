import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
    const supportOptions = [
        {
            title: 'FAQs',
            icon: 'help-circle-outline',
            onPress: () => {}
        },
        {
            title: 'Contact Support',
            icon: 'mail-outline',
            onPress: () => Linking.openURL('mailto:support@localmart.com')
        },
        {
            title: 'Call Us',
            icon: 'call-outline',
            onPress: () => Linking.openURL('tel:+1234567890')
        },
        {
            title: 'WhatsApp',
            icon: 'logo-whatsapp',
            onPress: () => Linking.openURL('whatsapp://send?phone=1234567890')
        }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                {supportOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionItem}
                        onPress={option.onPress}
                    >
                        <View style={styles.optionLeft}>
                            <Ionicons name={option.icon} size={24} color="#007AFF" />
                            <Text style={styles.optionText}>{option.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About LocalMart</Text>
                <Text style={styles.infoText}>
                    LocalMart is your local marketplace for buying and selling items in your community.
                    We're here to help you with any questions or issues you might have.
                </Text>
                <Text style={styles.version}>Version 1.0.0</Text>
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
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
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
    version: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
}); 