import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { isAuthenticated, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to LocalMart</Text>
            {isAuthenticated ? (
                <>
                    <Text style={styles.welcomeText}>Welcome back, {user?.username}!</Text>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('ProductList')}
                    >
                        <Text style={styles.buttonText}>Browse Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('AddProduct')}
                    >
                        <Text style={styles.buttonText}>Add New Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text style={styles.buttonText}>My Profile</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('ProductList')}
                    >
                        <Text style={styles.buttonText}>Browse Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Text style={styles.buttonText}>Login / Register</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 30,
        color: '#666',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
}); 