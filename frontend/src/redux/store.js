import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import shippingReducer from './shippingSlice';
import paymentReducer from './paymentSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    shipping: shippingReducer,
    payment: paymentReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      console.log('Dispatching action:', action);
      const result = next(action);
      console.log('New state:', store.getState());
      return result;
    }),
});