import 'expo-router/entry';
import combinedStore from '../slices/loginStore';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: combinedStore,
  });


export default () => {
    return (
        <Provider store={store}>
            <Stack
            screenOptions={{
                headerShown: false,
              }}>
                <Stack.Screen
                    name='index'
                    options={{ title: 'Welcome' }}
                    />
            </Stack>
        </Provider>
    )
};
