import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentMethod: localStorage.getItem('paymentMethod') || '',
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearPaymentMethod: (state) => {
      state.paymentMethod = '';
      localStorage.removeItem('paymentMethod');
    },
  },
});

export const { savePaymentMethod, clearPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;