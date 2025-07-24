import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('user'),
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null,
  },
  reducers: {
    login: (state, action) => {
      if (action.payload === null) return;
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
const userReducer = authSlice.reducer;

export default userReducer;

