import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    PermissionsAndroid
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pickImage } from '../utils/imagePicker';
import { updateProduct, deleteProductImage } from '../services/products';

export default function EditProductScreen({ route, navigation }) {
    const { product } = route.params;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        condition: product.condition,
        location: product.location,
        is_urgent: product.is_urgent,
        category: product.category,
    });
    const [images, setImages] = useState(product.images || []);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const updatedProduct = await updateProduct(product.id, formData);
            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = async () => {
        try {
            if (images.length >= 5) {
                Alert.alert('Limit Reached', 'Maximum 5 images allowed');
                return;
            }

            const result = await pickImage({ multiple: false });
            if (result && result[0]) {
                setImages(prev => [...prev, { uri: result[0].uri }]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleDeleteImage = async (index, imageId) => {
        try {
            if (imageId) {
                await deleteProductImage(product.id, imageId);
            }
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
        } catch (error) {
            Alert.alert('Error', 'Failed to delete image');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image 
                                source={{ uri: image.uri || image.image }}
                                style={styles.imagePreview}
                            />
                            <TouchableOpacity
                                style={styles.deleteImageButton}
                                onPress={() => handleDeleteImage(index, image.id)}
                            >
                                <Ionicons name="close-circle" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 5 && (
                        <TouchableOpacity
                            style={styles.addImageButton}
                            onPress={handleImagePick}
                        >
                            <Ionicons name="add" size={40} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={formData.title}
                    onChangeText={(text) => setFormData({...formData, title: text})}
                    placeholder="Product Title"
                />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({...formData, description: text})}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                />

                <TextInput
                    style={styles.input}
                    value={formData.price}
                    onChangeText={(text) => setFormData({...formData, price: text})}
                    placeholder="Price"
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) => setFormData({...formData, location: text})}
                    placeholder="Location"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Update Product</Text>
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
    imageSection: {
        padding: 15,
    },
    imageContainer: {
        marginRight: 10,
        position: 'relative',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    deleteImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        padding: 15,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
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