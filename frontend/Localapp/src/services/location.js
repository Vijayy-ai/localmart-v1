import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        const location = await Location.getCurrentPositionAsync({});
        return location;
    } catch (error) {
        console.error('Error getting location:', error);
        throw error;
    }
};

export const getLocationDetails = async (latitude, longitude) => {
    try {
        const response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
        });

        if (response.length > 0) {
            const address = response[0];
            return {
                city: address.city,
                region: address.region,
                country: address.country,
                postalCode: address.postalCode,
                formattedAddress: `${address.city}, ${address.region}`
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting location details:', error);
        throw error;
    }
};

export const searchLocations = async (searchText) => {
    try {
        const locations = await Location.geocodeAsync(searchText);
        return locations;
    } catch (error) {
        console.error('Error searching locations:', error);
        throw error;
    }
}; 