import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  name: string;
  key: number;
}

const initialState: LoginState = {
  name: localStorage.getItem('name') || 'Hello',
  key: localStorage.getItem('key') ? Number(localStorage.getItem('key')) : 0,
};

const loginSlice = createSlice({
  name: 'login',
  initialState : initialState,
  reducers: {
    inputName(state, action: PayloadAction<string>){
      state.name = action.payload;
    },
    inputKey(state, action : PayloadAction<number>) {
      state.key = action.payload
    },
  },
});

export const { inputName, inputKey } = loginSlice.actions;
export default loginSlice.reducer;