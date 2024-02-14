import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  userId : String
}

const initialState: LoginState = {
  userId: localStorage.getItem('userId') || '',
};

const loginSlice = createSlice({
  name: 'login',
  initialState : initialState,
  reducers: {
    inputUserId(state, action: PayloadAction<string>){
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },
  },
});

export const { inputUserId } = loginSlice.actions;
export default loginSlice.reducer;