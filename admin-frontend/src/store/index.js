import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import { getToken } from '../utils/tokenHelper';

const token = getToken();

const preloadedState = {
  auth: {
    admin: null,
    token: token || null,
    is2faverified: false,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
  },
  preloadedState,
});

export default store;