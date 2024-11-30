import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { compressImage } from './imageCompression';

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export const pickImage = async (options = {}) => {
    try {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Camera roll permission is required');
        }

        // Verify permissions are configured in app.json
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: !options.multiple,
            aspect: [4, 3],
            quality: 0.7,
            allowsMultipleSelection: options.multiple || false,
            selectionLimit: options.multiple ? 5 : 1, // Match ProductCard max images
            exif: false
        });

        if (!result.canceled && result.assets) {
            // Process and optimize images
            const processedAssets = await Promise.all(
                result.assets.map(async (asset) => {
                    const fileInfo = await FileSystem.getInfoAsync(asset.uri);
                    
                    // If file size is larger than MAX_IMAGE_SIZE, compress using ImageManipulator
                    if (fileInfo.size > MAX_IMAGE_SIZE) {
                        const compressedImage = await compressImage(asset.uri);
                        return {
                            ...asset,
                            uri: compressedImage.uri
                        };
                    }
                    return asset;
                })
            );
            return processedAssets;
        }
        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw error;
    }
};

export const takePhoto = async () => {
    try {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Camera permission is required');
        }

        // Verify camera permissions are configured in app.json
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            exif: false
        });

        if (!result.canceled && result.assets) {
            const asset = result.assets[0];
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            
            // If file size is larger than MAX_IMAGE_SIZE, compress using ImageManipulator
            if (fileInfo.size > MAX_IMAGE_SIZE) {
                const compressedImage = await compressImage(asset.uri);
                return {
                    ...asset,
                    uri: compressedImage.uri
                };
            }
            return asset;
        }
        return null;
    } catch (error) {
        console.error('Error taking photo:', error);
        throw error;
    }
};