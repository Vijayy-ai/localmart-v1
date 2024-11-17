import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { createProduct } from '../services/products';
import { useAuth } from '../context/AuthContext';

export default function AddProductScreen({ navigation }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        condition: 'new',
        quantity: '1',
        location: '',
        is_urgent: false,
    });

    const handleSubmit = async () => {
        if (!token) {
            Alert.alert('Error', 'Please login to add a product');
            navigation.navigate('Auth');
            return;
        }

        try {
            setLoading(true);
            const product = await createProduct(formData);
            Alert.alert('Success', 'Product listed successfully!');
            navigation.navigate('ProductList');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Product Title"
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
            />
            
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                multiline
                numberOfLines={4}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={formData.price}
                onChangeText={(text) => setFormData({...formData, price: text})}
                keyboardType="numeric"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => setFormData({...formData, location: text})}
            />
            
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>List Product</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
}); 