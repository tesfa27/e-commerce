import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../api/index.js';

export const fetchProductList = createAsyncThunk(
  'productList/fetchProducts',
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getAdmin(page);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'productList/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.create(productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'productList/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await productAPI.delete(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productListSlice = createSlice({
  name: 'productList',
  initialState: {
    loading: false,
    loadingCreate: false,
    loadingDelete: false,
    error: null,
    errorCreate: null,
    products: [],
    page: 1,
    pages: 1,
    createdProduct: null,
  },
  reducers: {
    clearCreatedProduct: (state) => {
      state.createdProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loadingCreate = true;
        state.errorCreate = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createdProduct = action.payload.product;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingCreate = false;
        state.errorCreate = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.products = state.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      });
  },
});

export const { clearCreatedProduct } = productListSlice.actions;
export default productListSlice.reducer;