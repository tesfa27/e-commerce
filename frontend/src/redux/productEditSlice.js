import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../api/index.js';

export const fetchProduct = createAsyncThunk(
  'productEdit/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getById(productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'productEdit/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.update(productId, productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productEditSlice = createSlice({
  name: 'productEdit',
  initialState: {
    loading: false,
    loadingUpdate: false,
    error: null,
    product: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loadingUpdate = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export default productEditSlice.reducer;