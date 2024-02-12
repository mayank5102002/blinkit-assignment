import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { inputName, inputKey } from '../../slices/loginSlice';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from '@/constants/values';

const SplashScreenComponent = () => {

  const app = initializeApp(firebaseConfig);

  const dispatch = useDispatch();
  const auth = getAuth(app);

  useEffect(() => {
    dispatch(inputName('Mayank'));
    dispatch(inputKey(15));
  }, []);

  const navigateToSignUp = () => {
    router.push('/signUp/');
  }

  const navigateToHomePage = () => {
    router.push('/homePage/');
  }

  const login = () => {
    signInWithEmailAndPassword(auth, 'jane.doe@example.com', 'SuperSecretPassword!')
      .then(() => {
        console.log('User signed in!');
        navigateToHomePage();
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (

    <View style={styles.container}>
      <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.title}>Lets Connect</Text>
        <Text style={styles.text}>with each other</Text>
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: '#FF6F61' }}
          onPress={() => navigateToSignUp()}>
          <Text style={styles.insideButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: '#FF6F61' }}
          onPress={() => login()}>
          <Text style={styles.insideButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  image: {
    height: '50%',
    width: '80%',
    flex: 0.3,
    marginBottom: 10,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    verticalAlign: 'top',
  },
  title: {
    fontSize: 40,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    fontFamily: 'sans-serif',
    fontSize: 24,
  },
  button: {
    height: '7%',
    width: '80%',
    marginTop: 60,
    marginBottom: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insideButtonText: {
    fontFamily: 'sans-serif',
    color: 'white',
    fontSize: 16,
  }
});

export default SplashScreenComponent;
