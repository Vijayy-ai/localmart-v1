import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/products';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'latest'
    });

    const fetchProducts = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            const data = await getProducts({
                search: searchQuery,
                ...filters
            });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts(true);
    };

    const handleSearch = () => {
        fetchProducts();
    };

    const renderProduct = ({ item }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        />
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                </View>
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => navigation.navigate('Filter', {
                        currentFilters: filters,
                        onApplyFilters: setFilters
                    })}
                >
                    <Ionicons name="options-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.productList}
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
                            {searchQuery 
                                ? 'No products found matching your search'
                                : 'No products available'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
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
    header: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
    filterButton: {
        padding: 10,
    },
    productList: {
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