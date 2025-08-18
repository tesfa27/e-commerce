import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from '../api/index.js';

// Initialize state with cartItems from localStorage
const initialState = {
  cartItems: (() => {
    try {
      const savedItems = localStorage.getItem("cartItems");
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage:", error);
      return [];
    }
  })(),
  shippingAddress: (() => {
    try {
      const savedAddress = localStorage.getItem("shippingAddress");
      return savedAddress ? JSON.parse(savedAddress) : {};
    } catch (error) {
      console.error("Failed to parse shippingAddress from localStorage:", error);
      return {};
    }
  })(),
  paymentMethod: localStorage.getItem("paymentMethod") || "",
  status: "idle", // idle | loading | succeeded | failed
  error: null, // Stores error messages
};

// Async thunk to add or update item in cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    // Validate input
    if (!product?._id) {
      return rejectWithValue("Invalid product data: missing _id");
    }
    if (quantity < 1) {
      return rejectWithValue("Invalid quantity: must be positive");
    }

    console.log("addToCart payload:", { product, quantity }); // Debug log

    const { cart } = getState();
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const newQuantity = existItem ? existItem.quantity + quantity : quantity;

    try {
      const { data } = await productAPI.getById(product._id);
      console.log("API response:", data); // Debug log
      if (!data || typeof data.countInStock === "undefined") {
        return rejectWithValue("Invalid product data from server");
      }
      if (data.countInStock < newQuantity) {
        return rejectWithValue(`Sorry, only ${data.countInStock} ${data.name} in stock`);
      }
      return {
        product: {
          _id: data._id,
          name: data.name,
          price: data.price,
          image: data.image,
          slug: data.slug,
          countInStock: data.countInStock,
        },
        quantity: newQuantity,
      };
    } catch (error) {
      console.error("addToCart API error:", error); // Debug log
      return rejectWithValue(error.response?.data?.message || "Error checking stock");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Increment item quantity with stock check
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload._id);
      if (item) {
        if (item.quantity + 1 > item.countInStock) {
          state.error = `Sorry, only ${item.countInStock} ${item.name} in stock`;
          return;
        }
        item.quantity += 1;
        try {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        } catch (error) {
          console.error("Failed to save cartItems to localStorage:", error);
        }
      }
    },
    // Decrement item quantity
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload._id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        try {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        } catch (error) {
          console.error("Failed to save cartItems to localStorage:", error);
        }
      }
    },
    // Remove item from cart
    deleteFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload._id);
      try {
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      } catch (error) {
        console.error("Failed to save cartItems to localStorage:", error);
      }
    },
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    // Save shipping address
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      try {
        localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Failed to save shippingAddress to localStorage:", error);
      }
    },
    // Save payment method
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", action.payload);
    },
    // Clear entire cart
    clearCart: (state) => {
      console.log('Clearing cart...'); // Add debug log
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = '';
      state.error = null;
      state.status = "idle";
      try {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("paymentMethod");
        console.log('Cart cleared successfully'); // Add debug log
      } catch (error) {
        console.error("Failed to clear data from localStorage:", error);
      }
      console.log('New cart state:', state.cartItems); // Add debug log
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { product, quantity } = action.payload;
        const existItem = state.cartItems.find((x) => x._id === product._id);
        state.cartItems = existItem
          ? state.cartItems.map((x) =>
              x._id === product._id ? { ...x, quantity, price: product.price } : x
            )
          : [...state.cartItems, { ...product, quantity }];
        try {
          localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        } catch (error) {
          console.error("Failed to save cartItems to localStorage:", error);
        }
        state.status = "succeeded";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { 
  increaseQuantity, 
  decreaseQuantity, 
  deleteFromCart, 
  clearError,
  clearCart,
  saveShippingAddress,
  savePaymentMethod 
} = cartSlice.actions;
export default cartSlice.reducer;