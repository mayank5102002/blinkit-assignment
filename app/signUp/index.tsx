import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { inputUserId } from '../../slices/loginSlice';
import { useDispatch } from 'react-redux';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/constants/values';
import { router } from 'expo-router';

const RegisterUser = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigateToHomePage = () => {
        clearStates();
        router.push('/homePage/');
    }

    const handleRegister = () => {
        if (password !== confirmPassword) {
            const errorMessage = "Passwords do not match";
            setError(errorMessage);
            return;
        }

        createUserWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                dispatch(inputUserId(user.uid));
                clearStates();
                navigateToHomePage();
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
    };

    const clearStates = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    }

    useEffect(() => {
        if (error != '') {
            console.log('Error:', error);
            alert(error);
            setError('');
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Register Now</Text>
                <Text style={styles.subtitle}>Create an account to join our community</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        justifyContent: 'center', // Center vertically
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#777',
    },
    form: {
        marginVertical: 20,
    },
    input: {
        height: 40,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        flex: 1, // Share space equally
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RegisterUser;