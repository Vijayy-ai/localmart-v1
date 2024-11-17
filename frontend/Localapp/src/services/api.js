export const API_URL = 'http://192.168.201.247:8000/api';

export const getHeaders = async () => {
    const token = await AsyncStorage.getItem('access_token');
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const testConnection = async () => {
    try {
        console.log('Attempting to connect to:', `${API_URL}/test/`);
        const response = await fetch(`${API_URL}/test/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Response status:', response.status);
        
        // First check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        console.log('Parsed API Response:', data);
        return data;
    } catch (error) {
        console.error('API Connection Error Details:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}; 