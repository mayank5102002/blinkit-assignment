import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { inputUserId } from '../../slices/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadImageUrl } from './uploadImageData';

const HomePage = () => {

    const dispatch = useDispatch();

    const { userId } = useSelector((state: any) => state.login);
    const [selectedImage, setSelectedImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setErrorMessage] = useState('');

    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + userId);

    const pickImage = async () => {

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            console.log('Camera permission denied.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        const imageRef = ref(storageRef, new Date().toISOString() + '.jpg');

        const response = await fetch(selectedImage);
        const blob = await response.blob();

        setUploading(true);
        try {
            await uploadBytes(imageRef, blob)
                .then((snapshot) => {
                    console.log('Uploaded a blob or file!');

                    getDownloadURL(imageRef)
                        .then((url) => {
                            console.log('Image URL:', url);
                            uploadImageUrl(url, userId);
                        })
                        .catch((error) => {
                            switch (error.code) {
                                case 'storage/object-not-found':
                                    setErrorMessage('File not found');
                                    break;
                                case 'storage/unauthorized':
                                    setErrorMessage('Unauthorized access');
                                    break;
                                case 'storage/canceled':
                                    setErrorMessage('Upload canceled');
                                    break;
                                case 'storage/unknown':
                                    setErrorMessage('Unknown error occurred');
                                    break;
                            }
                        });
                    setSelectedImage('');
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    setErrorMessage('Error uploading image');
                });

        } catch (error) {
            console.error('Error uploading image:', error);
            setErrorMessage('Error uploading image');
        } finally {
            setUploading(false);
            router.back();
        }
    };

    useEffect(() => {
        if (error !== '') {
            console.log('Error:', error);
            alert(error);
            setErrorMessage('');
        }
    }, [error]);

    return (
        <View style={styles.container}>
            {selectedImage && (
                <View style={styles.preview}>
                    {uploading ? (
                        <ActivityIndicator size="large" color="#f4511e" /> 
                    ) : (
                        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                    )}
                    <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                        <Text style={styles.buttonText}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    preview: {
        marginBottom: 20,
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    uploadButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        color: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomePage;