import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../api/index.js';

export const fetchOrderList = createAsyncThunk(
  'orderList/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orderList/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await orderAPI.delete(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderListSlice = createSlice({
  name: 'orderList',
  initialState: {
    loading: false,
    loadingDelete: false,
    error: null,
    orders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      });
  },
});

export default orderListSlice.reducer;