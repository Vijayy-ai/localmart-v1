import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../services/auth';

export default function ProfileScreen({ navigation }) {
    const { user, updateUserData } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setLoading(true);
                const response = await updateProfile({
                    profile_image: result.assets[0]
                });
                updateUserData(response);
                setLoading(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile image');
            setLoading(false);
        }
    };

    const renderStat = (label, value) => (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const renderMenuItem = (icon, title, onPress) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Ionicons name={icon} size={24} color="#007AFF" />
            <Text style={styles.menuText}>{title}</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.profileImageContainer}
                    onPress={handleImagePick}
                >
                    <Image
                        source={{ 
                            uri: user?.profile_image || 
                                'https://via.placeholder.com/150'
                        }}
                        style={styles.profileImage}
                    />
                    <View style={styles.editIconContainer}>
                        <Ionicons name="camera" size={20} color="white" />
                    </View>
                </TouchableOpacity>
                
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                
                <View style={styles.statsContainer}>
                    {renderStat('Listings', user?.listings_count || 0)}
                    {renderStat('Rating', user?.rating?.toFixed(1) || '0.0')}
                    {renderStat('Reviews', user?.reviews_count || 0)}
                </View>
            </View>

            <View style={styles.section}>
                {renderMenuItem(
                    'list-outline',
                    'My Listings',
                    () => navigation.navigate('MyListings')
                )}
                {renderMenuItem(
                    'heart-outline',
                    'Wishlist',
                    () => navigation.navigate('Wishlist')
                )}
                {renderMenuItem(
                    'chatbubbles-outline',
                    'Messages',
                    () => navigation.navigate('Messages')
                )}
                {renderMenuItem(
                    'notifications-outline',
                    'Notifications',
                    () => navigation.navigate('Notifications')
                )}
            </View>

            <View style={styles.section}>
                {renderMenuItem(
                    'person-outline',
                    'Edit Profile',
                    () => navigation.navigate('EditProfile')
                )}
                {renderMenuItem(
                    'settings-outline',
                    'Settings',
                    () => navigation.navigate('Settings')
                )}
                {renderMenuItem(
                    'help-circle-outline',
                    'Help & Support',
                    () => navigation.navigate('Support')
                )}
            </View>

            {user?.is_seller && (
                <View style={styles.section}>
                    {renderMenuItem(
                        'stats-chart-outline',
                        'Sales Analytics',
                        () => navigation.navigate('Analytics')
                    )}
                    {renderMenuItem(
                        'card-outline',
                        'Payment Settings',
                        () => navigation.navigate('PaymentSettings')
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    section: {
        backgroundColor: 'white',
        marginTop: 20,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
}); 