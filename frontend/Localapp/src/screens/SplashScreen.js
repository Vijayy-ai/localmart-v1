import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
    const navigation = useNavigation();
    const { isAuthenticated } = useAuth();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start(() => {
            navigation.replace(isAuthenticated ? 'Main' : 'Auth');
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
                <Image
                    source={require('../../assets/splash-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
                    Connecting Local Buyers and Sellers
                </Animated.Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    tagline: {
        fontSize: 18,
        color: '#007AFF',
        marginTop: 20,
        textAlign: 'center',
    },
}); 