import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView } from 'react-native';
import { inputUserId } from '../../slices/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { getDatabase, ref, get, child, onValue } from "firebase/database";

type ItemData = {
    uri: string;
}

type ImageData = {
    index: string;
    uri: string;
}

const Item = ({ uri }: ItemData) => (
    <View style={styles.imageContainer}>
        <Image
            source={{ uri: uri }}
            style={styles.image}
            resizeMode="cover"
        />
    </View>
);

const HomePage = () => {

    const dispatch = useDispatch();

    const { userId } = useSelector((state: any) => state.login);
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const database = getDatabase();

    const logout = () => {
        dispatch(inputUserId(''));
        router.replace('/');
    };

    const navigateToUploadImageScreen = () => {
        router.push('/uploadImage/');
    }

    useEffect(() => {
        const query = ref(database, `images/${userId}`);

        onValue(query, (snapshot) => {
            setImages([]);
            snapshot.forEach((childSnapshot) => {
                const image = childSnapshot.val();
                console.log(image.imageUrl);
                setImages((prevImages) => [...prevImages, { index: childSnapshot.key.toString(), uri: image.imageUrl }]);
            });
            if (snapshot.size === 0) {
                setError('No images found');
            }
            setLoading(false);
        }, (error) => {
            console.error('Error fetching images:', error);
            setError('An error occurred while fetching images.');
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (error !== '') {
            console.log('Error:', error);
            alert(error);
            setError('');
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome!</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <Text style={styles.loadingText}>Loading images...</Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={images}
                    renderItem={({ item }) => <Item uri={item.uri} />}
                    keyExtractor={item => item.index}
                    numColumns={2}
                />
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={navigateToUploadImageScreen}>
                <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#f4511e',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    grid: {
        justifyContent: 'space-between',
    },
    image: {
        width: 150,
        height: 200,
        margin: 10,
        borderRadius: 5,
    },
    uploadButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        margin: 20,
        alignSelf: 'center',
    },
    imageContainer: {
        flex: 1,
        margin: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    }
});

export default HomePage;