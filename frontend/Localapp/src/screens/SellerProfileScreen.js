import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSellerProfile, getSellerProducts } from '../services/users';
import ProductCard from '../components/ProductCard';
import { format } from 'date-fns';

export default function SellerProfileScreen({ route, navigation }) {
    const { sellerId } = route.params;
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadSellerData = async () => {
        try {
            const [profileData, productsData] = await Promise.all([
                getSellerProfile(sellerId),
                getSellerProducts(sellerId)
            ]);
            setSeller(profileData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error loading seller data:', error);
            Alert.alert('Error', 'Failed to load seller information');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadSellerData();
    }, [sellerId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadSellerData();
    };

    const handleContact = () => {
        if (!seller.phone_number) {
            Alert.alert('Error', 'Seller phone number not available');
            return;
        }
        navigation.navigate('ChatRoom', { 
            sellerId: seller.id,
            sellerName: `${seller.first_name} ${seller.last_name}`.trim()
        });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Image
                source={
                    seller?.profile_picture
                        ? { uri: seller.profile_picture }
                        : require('../../assets/default-avatar.png')
                }
                style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
                <Text style={styles.name}>
                    {`${seller?.first_name} ${seller?.last_name}`.trim()}
                </Text>
                <Text style={styles.joinDate}>
                    Member since {format(new Date(seller?.created_at), 'MMMM yyyy')}
                </Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.location}>{seller?.location}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={handleContact}
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                    <Text style={styles.contactButtonText}>Contact Seller</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={renderHeader}
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
                            No products listed yet
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
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
    profileInfo: {
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 5,
    },
    joinDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    productList: {
        padding: 10,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
}); 