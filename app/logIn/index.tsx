import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { inputUserId } from '../../slices/loginSlice';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/constants/values';

const app = initializeApp(firebaseConfig);

const SplashScreenComponent = () => {

  const dispatch = useDispatch();
  const auth = getAuth(app);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { userId } = useSelector((state: any) => state.login);

  const navigateToSignUp = () => {
    router.push('/signUp/');
  }

  const navigateToHomePage = () => {
    router.push('/homePage/');
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        console.log('User signed in!');
        dispatch(inputUserId(userCredential.user.uid));
        navigateToHomePage();
        clearStates();
      })
      .catch(error => {
        setError(error);
      });
  }

  const handleSignUp = () => {
    clearStates();
    navigateToSignUp();
  }

  const clearStates = () => {
    setUsername('');
    setPassword('');
    setError(null);
  }

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
      alert(error);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (userId) {
      setTimeout(() => {
        navigateToHomePage();
      }, 2000);
      console.log('userId:', userId);
    }
  }, []);

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lets Connect</Text>
        <Text style={styles.subtitle}>Join or sign in to your account</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username or Email"
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
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
});

export default SplashScreenComponent;
