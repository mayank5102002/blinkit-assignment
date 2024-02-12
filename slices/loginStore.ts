import { configureStore, combineReducers } from '@reduxjs/toolkit';
import  loginReducer  from './loginSlice';

const store = combineReducers({
    login: loginReducer,
});

export default store;