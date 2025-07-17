import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingAddress: (() => {
    try {
      const savedAddress = localStorage.getItem('shippingAddress');
      return savedAddress ? JSON.parse(savedAddress) : {};
    } catch (error) {
      console.error('Failed to parse shippingAddress from localStorage:', error);
      return {};
    }
  })(),
  status: 'idle',
  error: null,
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      try {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      } catch (error) {
        console.error('Failed to save shippingAddress to localStorage:', error);
      }
    },
    clearShippingAddress: (state) => {
      state.shippingAddress = {};
      localStorage.removeItem('shippingAddress');
    },
  },
});

export const { saveShippingAddress, clearShippingAddress } = shippingSlice.actions;
export default shippingSlice.reducer;