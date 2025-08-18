import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../api/index.js';

export const fetchUser = createAsyncThunk(
  'userEdit/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.getById(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'userEdit/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.update(userId, userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState: {
    loading: false,
    loadingUpdate: false,
    error: null,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loadingUpdate = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      });
  },
});

export default userEditSlice.reducer;