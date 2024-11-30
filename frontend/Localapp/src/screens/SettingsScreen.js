import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
    const { user, updateSettings } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [locationServices, setLocationServices] = useState(true);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                            });
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    const renderSettingItem = (icon, title, value, onToggle) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={24} color="#007AFF" />
                <Text style={styles.settingText}>{title}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "#767577", true: "#007AFF" }}
            />
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                {renderSettingItem(
                    'notifications-outline',
                    'Push Notifications',
                    notifications,
                    setNotifications
                )}
                {renderSettingItem(
                    'mail-outline',
                    'Email Notifications',
                    emailNotifications,
                    setEmailNotifications
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appearance</Text>
                {renderSettingItem(
                    'moon-outline',
                    'Dark Mode',
                    darkMode,
                    setDarkMode
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy</Text>
                {renderSettingItem(
                    'location-outline',
                    'Location Services',
                    locationServices,
                    setLocationServices
                )}
            </View>

            <View style={styles.section}>
                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <Ionicons name="key-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Privacy')}
                >
                    <Ionicons name="shield-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Terms')}
                >
                    <Ionicons name="document-text-outline" size={24} color="#007AFF" />
                    <Text style={styles.menuText}>Terms of Service</Text>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    section: {
        backgroundColor: 'white',
        marginTop: 20,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginVertical: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 10,
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
    logoutButton: {
        backgroundColor: '#FF3B30',
        marginTop: 30,
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        marginBottom: 30,
    },
}); 