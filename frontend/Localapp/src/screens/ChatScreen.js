import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getChatMessages, sendMessage } from '../services/chat';

export default function ChatScreen({ route, navigation }) {
    const { chatRoomId, productId, sellerId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const flatListRef = useRef();

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [chatRoomId]);

    const loadMessages = async () => {
        try {
            const data = await getChatMessages(chatRoomId);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        try {
            const message = await sendMessage(chatRoomId, newMessage.trim());
            setMessages(prev => [...prev, message]);
            setNewMessage('');
            flatListRef.current?.scrollToEnd();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.sender.id === currentUser?.id;

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                <Text style={styles.messageText}>{item.content}</Text>
                <Text style={styles.timestamp}>
                    {format(new Date(item.created_at), 'HH:mm')}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No messages yet</Text>
                    </View>
                }
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleSend}
                >
                    <Ionicons name="send" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messagesList: {
        padding: 15,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    ownMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    timestamp: {
        fontSize: 12,
        color: '#rgba(255,255,255,0.7)',
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        padding: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16,
    },
}); 