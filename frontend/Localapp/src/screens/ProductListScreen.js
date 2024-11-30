import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
    TouchableOpacity,
    Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/products';
import ProductCard from '../components/ProductCard';
import { ErrorView } from '../components/ErrorHandler';
import { handleError } from '../utils/errorHandler';

export default function ProductListScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    const loadProducts = async () => {
        try {
            setError(null);
            const data = await getProducts(filters);
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('Invalid data format:', data);
                setError('Invalid data format received');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setError(handleError(error, navigation));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadProducts();
    };

    const handleFilter = () => {
        navigation.navigate('Filters', {
            currentFilters: filters,
            onApplyFilters: (newFilters) => setFilters(newFilters)
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.filterButton}
                onPress={handleFilter}
            >
                <Ionicons name="filter" size={24} color="#007AFF" />
                <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            {Object.keys(filters).length > 0 && (
                <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setFilters({})}
                >
                    <Text style={styles.clearText}>Clear Filters</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <ErrorView 
                message={error}
                onRetry={loadProducts}
            />
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="basket-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No products found
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
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    filterText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#007AFF',
    },
    clearButton: {
        padding: 8,
    },
    clearText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    listContent: {
        padding: 10,
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
        marginTop: 10,
        textAlign: 'center',
    },
}); 