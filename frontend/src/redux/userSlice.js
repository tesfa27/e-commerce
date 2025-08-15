import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initialize userInfo from localStorage
const initialState = {
  userInfo: (() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to parse userInfo from localStorage:', error);
      return null;
    }
  })(),
  status: 'idle', // idle | loading | succeeded | failed
  updateStatus: 'idle',
  error: null,
  updateError: null,
};

// Async thunk for user sign-in
export const signIn = createAsyncThunk(
  'user/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/signin', { email, password });
      return data; // Expect { user: { _id, email, ... }, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Sign-in failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Could not create account'
      );
    }
  }
);

// Async thunk for user sign-out
export const signOut = createAsyncThunk(
  'user/signOut',
  async () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems'); // Optional: Clear cart on sign-out
    window.location.href = '/signin'; // Use window.location instead of navigate
    return null;
  }
);

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        try {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        } catch (error) {
          console.error('Failed to save userInfo to localStorage:', error);
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'idle';
        state.userInfo = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.userInfo = action.payload;
        try {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        } catch (error) {
          console.error('Failed to save userInfo to localStorage:', error);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      });
  },
});

export const { clearError, resetUpdateStatus } = userSlice.actions;
export default userSlice.reducer;