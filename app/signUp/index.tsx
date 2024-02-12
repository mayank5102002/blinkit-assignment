import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/constants/values';
import { router } from 'expo-router';

const RegisterUser = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigateToHomePage = () => {
        router.push('/homePage/');
    }

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, 'jane.doe@example.com', 'SuperSecretPassword!')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigateToHomePage();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

export default RegisterUser;