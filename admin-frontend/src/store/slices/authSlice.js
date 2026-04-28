import { createSlice } from '@reduxjs/toolkit';
import { getToken } from '../../utils/tokenHelper';

const token = getToken();

const initialState = {
  admin: null,
  token: token || null,
  is2faverified: false,
  isAuthenticated: !!token,
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
      state.error = null;
    },

    set2FaVerified: (state, action) => {
      state.is2faverified = action.payload;
    },

    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.is2faverified = false;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  set2FaVerified,
  logout,
} = authSlice.actions;

export default authSlice.reducer;