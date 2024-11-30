import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri) => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024 } }],
            {
                compress: 0.7,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
}; 