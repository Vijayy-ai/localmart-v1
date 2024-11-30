import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyListings } from '../services/products';
import ProductCard from '../components/ProductCard';

export default function MyListingsScreen({ navigation }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadListings = async () => {
        try {
            const data = await getMyListings();
            setListings(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load your listings');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadListings();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadListings();
    };

    const handleEdit = (product) => {
        navigation.navigate('EditProduct', { product });
    };

    const handleDelete = (productId) => {
        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Add delete API call here
                            setListings(listings.filter(item => item.id !== productId));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete listing');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={listings}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.id)}
                        showActions
                    />
                )}
                keyExtractor={item => item.id.toString()}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="basket-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No listings yet</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate('AddProduct')}
                        >
                            <Text style={styles.addButtonText}>Add Your First Listing</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginVertical: 10,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
}); 