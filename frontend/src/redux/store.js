import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import shippingReducer from './shippingSlice';
import paymentReducer from './paymentSlice';
import orderReducer from './orderSlice';
import dashboardReducer from './dashboardSlice';
import productListReducer from './productListSlice';
import productEditReducer from './productEditSlice';
import orderListReducer from './orderListSlice';
import userListReducer from './userListSlice';
import userEditReducer from './userEditSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    productList: productListReducer,
    productEdit: productEditReducer,
    orderList: orderListReducer,
    userList: userListReducer,
    userEdit: userEditReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      console.log('Dispatching action:', action);
      const result = next(action);
      console.log('New state:', store.getState());
      return result;
    }),
});