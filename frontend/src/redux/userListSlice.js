import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../api/index.js';

export const fetchUserList = createAsyncThunk(
  'userList/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'userList/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userAPI.delete(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userListSlice = createSlice({
  name: 'userList',
  initialState: {
    loading: false,
    loadingDelete: false,
    error: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      });
  },
});

export default userListSlice.reducer;