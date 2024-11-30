import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

export default function FilterScreen({ route, navigation }) {
    const { currentFilters, onApplyFilters } = route.params;
    const [filters, setFilters] = useState(currentFilters);

    const categories = [
        'Electronics',
        'Fashion',
        'Home & Garden',
        'Sports',
        'Books',
        'Others'
    ];

    const handleApply = () => {
        onApplyFilters(filters);
        navigation.goBack();
    };

    const handleReset = () => {
        const resetFilters = {
            category: '',
            minPrice: '',
            maxPrice: '',
            distance: '5',
            sortBy: 'latest'
        };
        setFilters(resetFilters);
        onApplyFilters(resetFilters);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.categoryContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    filters.category === category && styles.categoryButtonActive
                                ]}
                                onPress={() => setFilters({ ...filters, category })}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    filters.category === category && styles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Price Range */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Range</Text>
                    <View style={styles.priceInputs}>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Min"
                            value={filters.minPrice}
                            onChangeText={(text) => setFilters({...filters, minPrice: text})}
                            keyboardType="numeric"
                        />
                        <Text style={styles.priceSeparator}>-</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChangeText={(text) => setFilters({...filters, maxPrice: text})}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Distance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Distance</Text>
                    <Text style={styles.distanceText}>{filters.distance} km</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={50}
                        value={Number(filters.distance)}
                        onValueChange={(value) => 
                            setFilters({...filters, distance: Math.round(value).toString()})
                        }
                        minimumTrackTintColor="#007AFF"
                        maximumTrackTintColor="#ddd"
                    />
                </View>

                {/* Sort By */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <View style={styles.sortContainer}>
                        {['latest', 'price_low', 'price_high', 'distance'].map((sort) => (
                            <TouchableOpacity
                                key={sort}
                                style={[
                                    styles.sortButton,
                                    filters.sortBy === sort && styles.sortButtonActive
                                ]}
                                onPress={() => setFilters({ ...filters, sortBy: sort })}
                            >
                                <Text style={[
                                    styles.sortText,
                                    filters.sortBy === sort && styles.sortTextActive
                                ]}>
                                    {sort.replace('_', ' ').charAt(0).toUpperCase() + 
                                     sort.replace('_', ' ').slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.resetButton} 
                    onPress={handleReset}
                >
                    <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.applyButton} 
                    onPress={handleApply}
                >
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        padding: 15,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
    },
    categoryButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoryText: {
        color: '#666',
    },
    categoryTextActive: {
        color: '#fff',
    },
    priceInputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5,
    },
    priceSeparator: {
        marginHorizontal: 10,
        color: '#666',
    },
    distanceText: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 5,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sortContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    sortButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
    },
    sortButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    sortText: {
        color: '#666',
    },
    sortTextActive: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    resetButton: {
        flex: 1,
        padding: 15,
        marginRight: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    applyButton: {
        flex: 2,
        padding: 15,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
}); 