import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: null,
  is2faverified: false,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    set2FaVerified: (state, action) => {
      state.is2faverified = action.payload;
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.is2faverified = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, set2FaVerified, logout } = authSlice.actions;
export default authSlice.reducer;
