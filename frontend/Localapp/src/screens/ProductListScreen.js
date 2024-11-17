import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductListScreen({ navigation }) {
  // Temporary dummy data
  const products = [
    { id: '1', title: 'Product 1', price: '₹100', location: 'Mumbai' },
    { id: '2', title: 'Product 2', price: '₹200', location: 'Delhi' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <Text style={styles.productLocation}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  productLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
}); 