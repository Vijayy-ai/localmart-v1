import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { createProduct } from '../services/products';

export default function AddProductScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
    });

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'Maximum 5 images allowed');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImages([...images, result.assets[0]]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!formData.title || !formData.price || images.length === 0) {
                Alert.alert('Error', 'Please fill in all required fields and add at least one image');
                return;
            }

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                images: images.map(img => ({
                    uri: img.uri,
                    type: 'image/jpeg',
                    name: 'product_image.jpg'
                }))
            };

            await createProduct(productData);
            Alert.alert('Success', 'Product listed successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error creating product:', error);
            Alert.alert('Error', 'Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri: image.uri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Ionicons name="close-circle" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 5 && (
                        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                            <Ionicons name="camera-outline" size={40} color="#007AFF" />
                            <Text style={styles.addImageText}>Add Image</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    value={formData.category}
                    onChangeText={(text) => setFormData({ ...formData, category: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>List Product</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageSection: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    imageContainer: {
        marginRight: 10,
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        color: '#007AFF',
        marginTop: 5,
    },
    form: {
        padding: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 