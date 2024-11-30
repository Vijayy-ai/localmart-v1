import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategories } from '../services/categories';

const { width } = Dimensions.get('window');
const COLUMN_NUM = 3;
const ITEM_SIZE = (width - 40) / COLUMN_NUM;

export default function CategoryScreen({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedParent, setSelectedParent] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category) => {
        if (category.children?.length > 0) {
            setSelectedParent(category.id);
        } else {
            navigation.navigate('Explore', { 
                screen: 'ProductList',
                params: { categoryId: category.id }
            });
        }
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(item)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={32} color="#007AFF" />
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
                {item.name}
            </Text>
            {item.children?.length > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.children.length}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const displayCategories = selectedParent
        ? categories.find(c => c.id === selectedParent)?.children || []
        : categories.filter(c => !c.parent);

    return (
        <View style={styles.container}>
            {selectedParent && (
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => setSelectedParent(null)}
                >
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backText}>All Categories</Text>
                </TouchableOpacity>
            )}
            
            <FlatList
                data={displayCategories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id.toString()}
                numColumns={COLUMN_NUM}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="folder-open-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No categories found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 10,
    },
    categoryItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        margin: 5,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
    },
});