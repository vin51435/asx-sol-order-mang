import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  user: any;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    hydrateUser(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
  },
});

export const { login, logout, hydrateUser } = authSlice.actions;
const userReducer = authSlice.reducer;

export default userReducer;

