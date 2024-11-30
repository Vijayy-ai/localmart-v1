import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import SplashScreen from '../screens/SplashScreen';

// Import all screens
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import FilterScreen from '../screens/FilterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'HomeTab':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Explore':
                            iconName = focused ? 'search' : 'search-outline';
                            break;
                        case 'AddProduct':
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                            break;
                        case 'Chat':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen 
                name="HomeTab" 
                component={HomeScreen} 
                options={{ title: 'Home' }} 
            />
            <Tab.Screen 
                name="Explore" 
                component={ProductListScreen} 
            />
            <Tab.Screen 
                name="AddProduct" 
                component={AddProductScreen} 
                options={{ title: 'Sell' }} 
            />
            <Tab.Screen 
                name="Chat" 
                component={ChatListScreen} 
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
            />
        </Tab.Navigator>
    );
}

// Main App Navigator
export default function AppNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#007AFF',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            >
                <Stack.Screen 
                    name="Splash" 
                    component={SplashScreen} 
                    options={{ headerShown: false }} 
                />
                
                {isAuthenticated ? (
                    <>
                        <Stack.Screen 
                            name="Main" 
                            component={MainTabs}
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="ProductDetail" 
                            component={ProductDetailScreen}
                        />
                        <Stack.Screen 
                            name="EditProduct" 
                            component={EditProductScreen}
                        />
                        <Stack.Screen 
                            name="ChatRoom" 
                            component={ChatScreen}
                        />
                        <Stack.Screen 
                            name="Notifications" 
                            component={NotificationsScreen}
                        />
                        <Stack.Screen 
                            name="Settings" 
                            component={SettingsScreen}
                        />
                        <Stack.Screen 
                            name="MyListings" 
                            component={MyListingsScreen}
                        />
                        <Stack.Screen 
                            name="Filter" 
                            component={FilterScreen}
                            options={{
                                title: 'Filter Products',
                                headerRight: () => null
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                            name="Auth" 
                            component={AuthScreen}
                            options={{ headerShown: false }} 
                        />
                        <Stack.Screen 
                            name="ProductDetail" 
                            component={ProductDetailScreen}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}