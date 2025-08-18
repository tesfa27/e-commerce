import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../api/index.js';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.create(orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getById(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.pay(orderId, paymentResult);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'order/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getMine();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    loadingPay: false,
    loadingHistory: false,
    error: null,
    errorPay: null,
    errorHistory: null,
    order: null,
    orders: [],
    success: false,
    successPay: false,
  },
  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.error = null;
      state.order = null;
      state.success = false;
    },
    resetPay: (state) => {
      state.loadingPay = false;
      state.errorPay = null;
      state.successPay = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(payOrder.pending, (state) => {
        state.loadingPay = true;
        state.errorPay = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loadingPay = false;
        state.successPay = true;
        state.order = action.payload.order;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loadingPay = false;
        state.errorPay = action.payload;
      })
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loadingHistory = true;
        state.errorHistory = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.errorHistory = action.payload;
      });
  },
});

export const { resetOrder, resetPay } = orderSlice.actions;
export default orderSlice.reducer;