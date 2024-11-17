import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
  });

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      throw new Error('Username and password are required');
    }
    if (!isLogin && !formData.email) {
      throw new Error('Email is required for registration');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      validateForm();

      if (isLogin) {
        console.log('Attempting login...');
        await login(formData.username, formData.password);
        navigation.replace('Home');
      } else {
        console.log('Attempting registration...');
        await register(formData);
        Alert.alert(
          'Success', 
          'Registration successful! Please login.',
          [{ text: 'OK', onPress: () => setIsLogin(true) }]
        );
        setFormData({...formData, password: ''});
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({...formData, username: text})}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
      />
      
      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            multiline
          />
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
            {isLogin ? 'Login' : 'Register'}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  switchText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 