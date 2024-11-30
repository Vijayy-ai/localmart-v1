export const handleError = (error, navigation) => {
    console.error('Error:', error);

    if (error.message.includes('Authentication required') || 
        error.message.includes('Please login')) {
        navigation.navigate('Auth');
        return 'Please login to continue';
    }

    if (error.message.includes('Network request failed')) {
        return 'Network error. Please check your connection.';
    }

    return error.message || 'An unexpected error occurred';
}; 