import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Privacy Policy</Text>
                <Text style={styles.section}>
                    Your privacy is important to us. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you use our application.
                </Text>
                
                <Text style={styles.heading}>Information We Collect</Text>
                <Text style={styles.text}>
                    We collect information that you provide directly to us when you:
                    {'\n'}- Create an account
                    {'\n'}- List a product
                    {'\n'}- Message other users
                    {'\n'}- Use our location services
                </Text>

                <Text style={styles.heading}>How We Use Your Information</Text>
                <Text style={styles.text}>
                    We use the information we collect to:
                    {'\n'}- Provide and maintain our services
                    {'\n'}- Communicate with you
                    {'\n'}- Improve our services
                    {'\n'}- Ensure platform safety
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    section: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    text: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
}); 