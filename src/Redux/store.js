import { configureStore } from '@reduxjs/toolkit';
import countryReducer from './slices/countrySlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    countries: countryReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;