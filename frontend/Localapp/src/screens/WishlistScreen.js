import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { getWishlist } from '../services/products';
import { useAuth } from '../context/AuthContext';

export default function WishlistScreen() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const { isAuthenticated } = useAuth();

    const loadWishlist = async () => {
        try {
            if (!isAuthenticated) {
                setWishlist([]);
                return;
            }
            const data = await getWishlist();
            setWishlist(data);
        } catch (error) {
            console.error('Error loading wishlist:', error);
            Alert.alert('Error', 'Failed to load wishlist');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, [isAuthenticated]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadWishlist();
    };

    const handleProductPress = (product) => {
        navigation.navigate('ProductDetail', { product });
    };

    const handleWishlistToggle = async (productId) => {
        try {
            await toggleWishlist(productId);
            // Remove item from local state
            setWishlist(prev => prev.filter(item => item.product.id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            Alert.alert('Error', 'Failed to update wishlist');
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Please login to view your wishlist
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={wishlist}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item.product}
                        onPress={() => handleProductPress(item.product)}
                        onWishlist={() => handleWishlistToggle(item.product.id)}
                        isWishlist={true}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Your wishlist is empty
                        </Text>
                    </View>
                }
            />
        </View>
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
    listContent: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
}); 