import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    Alert,
    Share,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toggleWishlist, getProductDetails } from '../services/products';

export default function ProductDetailScreen({ route, navigation }) {
    const { product: initialProduct } = route.params;
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadProductDetails();
    }, []);

    const loadProductDetails = async () => {
        try {
            setLoading(true);
            const details = await getProductDetails(product.id);
            setProduct(details);
        } catch (error) {
            console.error('Error loading product details:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        if (!product.seller.phone_number) {
            Alert.alert('Error', 'Seller phone number not available');
            return;
        }
        Linking.openURL(`tel:${product.seller.phone_number}`);
    };

    const handleChat = () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to chat with the seller', [
                { text: 'Cancel' },
                { text: 'Login', onPress: () => navigation.navigate('Auth') }
            ]);
            return;
        }
        navigation.navigate('ChatRoom', { 
            sellerId: product.seller.id,
            productId: product.id 
        });
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${product.name} on LocalMart!\nPrice: $${product.price}`,
                title: product.name,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleToggleWishlist = async () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to add to wishlist');
            return;
        }
        try {
            const result = await toggleWishlist(product.id);
            setProduct(prev => ({
                ...prev,
                is_wishlisted: !prev.is_wishlisted
            }));
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            Alert.alert('Error', 'Failed to update wishlist');
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
            {/* Image Carousel */}
            <View style={styles.imageContainer}>
                <ScrollView 
                    horizontal 
                    pagingEnabled 
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(
                            e.nativeEvent.contentOffset.x / 
                            e.nativeEvent.layoutMeasurement.width
                        );
                        setCurrentImageIndex(index);
                    }}
                >
                    {product.images.map((image, index) => (
                        <Image 
                            key={index}
                            source={{ uri: image.url }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
                {/* Image Indicators */}
                <View style={styles.indicatorContainer}>
                    {product.images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentImageIndex === index && styles.indicatorActive
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>{product.name}</Text>
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>${product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>
                
                {/* Seller Info */}
                <TouchableOpacity 
                    style={styles.sellerContainer}
                    onPress={() => navigation.navigate('SellerProfile', { 
                        sellerId: product.seller.id 
                    })}
                >
                    <Image 
                        source={{ 
                            uri: product.seller.profile_picture || 
                                'https://via.placeholder.com/50' 
                        }}
                        style={styles.sellerImage}
                    />
                    <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>
                            {product.seller.first_name} {product.seller.last_name}
                        </Text>
                        <Text style={styles.location}>{product.location}</Text>
                    </View>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity 
                        style={[styles.button, styles.callButton]}
                        onPress={handleCall}
                    >
                        <Ionicons name="call-outline" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.chatButton]}
                        onPress={handleChat}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                        <Text style={styles.buttonText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button, styles.wishlistButton]}
                        onPress={handleToggleWishlist}
                    >
                        <Ionicons 
                            name={product.is_wishlisted ? "heart" : "heart-outline"} 
                            size={24} 
                            color={product.is_wishlisted ? "#FF3B30" : "#007AFF"} 
                        />
                    </TouchableOpacity>
                </View>
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
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    productImage: {
        width: 400,
        height: 300,
    },
    indicatorContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    indicatorActive: {
        backgroundColor: '#007AFF',
    },
    infoContainer: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#007AFF',
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        marginBottom: 20,
    },
    sellerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    sellerInfo: {
        marginLeft: 15,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    callButton: {
        backgroundColor: '#4CD964',
    },
    chatButton: {
        backgroundColor: '#007AFF',
    },
    wishlistButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
    },
    buttonText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '600',
    },
}); 