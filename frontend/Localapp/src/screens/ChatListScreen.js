import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getChats } from '../services/chat';
import { format } from 'date-fns';

export default function ChatListScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    const loadChats = async () => {
        try {
            const data = await getChats();
            setChats(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load chats');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadChats();
    };

    const renderChatItem = ({ item }) => {
        const otherUser = item.participants.find(p => p.id !== user.id);
        const lastMessage = item.last_message;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('Chat', {
                    chatId: item.id,
                    productId: item.product.id,
                    productTitle: item.product.title,
                    otherUser
                })}
            >
                <Image
                    source={{ 
                        uri: otherUser.profile_image || 
                            'https://via.placeholder.com/50'
                    }}
                    style={styles.avatar}
                />
                
                <View style={styles.chatInfo}>
                    <View style={styles.headerRow}>
                        <Text style={styles.username}>{otherUser.username}</Text>
                        <Text style={styles.time}>
                            {format(new Date(lastMessage?.created_at || item.updated_at), 'PP')}
                        </Text>
                    </View>
                    
                    <Text style={styles.productTitle} numberOfLines={1}>
                        {item.product.title}
                    </Text>
                    
                    {lastMessage && (
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {lastMessage.content}
                        </Text>
                    )}

                    {item.unread_count > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>
                                {item.unread_count}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id.toString()}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('Explore')}
                        >
                            <Text style={styles.browseButtonText}>
                                Browse Products
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatInfo: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
    },
    time: {
        fontSize: 12,
        color: '#666',
    },
    productTitle: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    unreadBadge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginVertical: 10,
    },
    browseButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 