import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen({ navigation }) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: ''
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required');
            }

            if (!isLogin && formData.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }

            if (isLogin) {
                console.log('Attempting login with:', {
                    email: formData.email,
                    password: formData.password
                });
                
                const response = await login(formData.email, formData.password);
                console.log('Login successful:', response);
                navigation.replace('Main');
            } else {
                console.log('Attempting registration with:', {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name || 'User',
                    last_name: formData.last_name || '',
                    phone: formData.phone || '',
                    address: formData.address || ''
                });

                await register({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name || 'User',
                    last_name: formData.last_name || '',
                    phone: formData.phone || '',
                    address: formData.address || ''
                });

                Alert.alert(
                    'Success', 
                    'Registration successful! Please login.',
                    [{ text: 'OK', onPress: () => {
                        setIsLogin(true);
                        setFormData({
                            ...formData,
                            password: '',
                            first_name: '',
                            last_name: '',
                            phone: '',
                            address: ''
                        });
                    }}]
                );
            }
        } catch (error) {
            console.error('Auth error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to LocalMart</Text>
                        <Text style={styles.subtitle}>
                            {isLogin ? 'Sign in to continue' : 'Create a new account'}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({...formData, email: text})}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={(text) => setFormData({...formData, password: text})}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        {!isLogin && (
                            <>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First Name"
                                        value={formData.first_name}
                                        onChangeText={(text) => setFormData({...formData, first_name: text})}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last Name (Optional)"
                                        value={formData.last_name}
                                        onChangeText={(text) => setFormData({...formData, last_name: text})}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone Number (Optional)"
                                        value={formData.phone}
                                        onChangeText={(text) => setFormData({...formData, phone: text})}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Address (Optional)"
                                        value={formData.address}
                                        onChangeText={(text) => setFormData({...formData, address: text})}
                                        multiline
                                    />
                                </View>
                            </>
                        )}

                        <TouchableOpacity 
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.switchButton}
                            onPress={() => {
                                setIsLogin(!isLogin);
                                setFormData({
                                    email: '',
                                    password: '',
                                    first_name: '',
                                    last_name: '',
                                    phone: '',
                                    address: ''
                                });
                            }}
                        >
                            <Text style={styles.switchText}>
                                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchText: {
        color: '#007AFF',
        fontSize: 14,
    },
}); 