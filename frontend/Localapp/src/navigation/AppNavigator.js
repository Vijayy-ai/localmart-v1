import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: '#007AFF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: '600',
    },
};

export default function AppNavigator() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions}>
                {isAuthenticated ? (
                    // Authenticated stack
                    <>
                        <Stack.Screen 
                            name="Home" 
                            component={HomeScreen}
                            options={{ title: 'LocalMart' }}
                        />
                        <Stack.Screen 
                            name="ProductList" 
                            component={ProductListScreen}
                            options={{ title: 'Products Near You' }}
                        />
                        <Stack.Screen 
                            name="AddProduct" 
                            component={AddProductScreen}
                            options={{ title: 'Add New Product' }}
                        />
                        <Stack.Screen 
                            name="Profile" 
                            component={ProfileScreen}
                            options={{ title: 'My Profile' }}
                        />
                    </>
                ) : (
                    // Non-authenticated stack
                    <>
                        <Stack.Screen 
                            name="Home" 
                            component={HomeScreen}
                            options={{ title: 'LocalMart' }}
                        />
                        <Stack.Screen 
                            name="Auth" 
                            component={AuthScreen}
                            options={{ title: 'Login / Register' }}
                        />
                        <Stack.Screen 
                            name="ProductList" 
                            component={ProductListScreen}
                            options={{ title: 'Products Near You' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}