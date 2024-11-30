import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
const cardWidth = (width - 30) / 2;

export default function ProductCard({ 
    product, 
    onPress, 
    onWishlist, 
    onEdit, 
    onDelete,
    showActions = false,
    isWishlist = false 
}) {
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image
                source={
                    product.images && product.images.length > 0
                        ? { uri: product.images[0].image }
                        : require('../../assets/placeholder.png')
                }
                style={styles.image}
                resizeMode="cover"
            />
            
            {(onWishlist || isWishlist) && (
                <TouchableOpacity 
                    style={styles.wishlistButton}
                    onPress={onWishlist}
                >
                    <Ionicons 
                        name={isWishlist ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isWishlist ? "#FF3B30" : "#007AFF"} 
                    />
                </TouchableOpacity>
            )}

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>
                <Text style={styles.price}>₹{product.price}</Text>
                
                <View style={styles.details}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.location} numberOfLines={1}>
                            {product.location}
                        </Text>
                    </View>
                    <Text style={styles.date}>
                        {format(new Date(product.created_at), 'MMM d')}
                    </Text>
                </View>

                {showActions && (
                    <View style={styles.actions}>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            onPress={onEdit}
                        >
                            <Ionicons name="create-outline" size={20} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]} 
                            onPress={onDelete}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 5,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: cardWidth,
    },
    wishlistButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    info: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#1C1C1E',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 8,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    location: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
    },
    deleteButton: {
        marginLeft: 12,
    },
}); 