import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/profile';

export default function EditProfileScreen({ navigation }) {
    const { user, updateUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const updatedUser = await updateProfile(formData);
            updateUserData(updatedUser);
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) => setFormData({...formData, username: text})}
                    placeholder="Enter username"
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    placeholder="Enter email"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Phone</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({...formData, phone: text})}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.address}
                    onChangeText={(text) => setFormData({...formData, address: text})}
                    placeholder="Enter address"
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
}); 