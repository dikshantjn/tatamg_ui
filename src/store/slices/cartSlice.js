import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VendorProductService } from '../../services/User/Products/vendor-product.service';
import { getUserId, isAuthenticated } from '../../services/User/Auth/auth.utils';

// Async thunk for fetching cart items from backend
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) {
        return rejectWithValue('User not authenticated');
      }
      
      const userId = getUserId();
      if (!userId) {
        return rejectWithValue('User ID not found');
      }
      
      const cartItems = await VendorProductService.getCartItems(userId);
      return cartItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return rejectWithValue(error.message || 'Failed to fetch cart items');
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, quantity = 1, image, category } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          name,
          price,
          quantity,
          image,
          category,
        });
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
        
        // Recalculate totals
        state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
        state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    
    clearCartError: (state) => {
      state.error = null;
    },

    // Set cart items from API response
    setCartItems: (state, action) => {
      const cartItems = action.payload;
      state.items = cartItems;
      state.itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      state.total = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        const cartItems = action.payload;
        state.items = cartItems;
        state.itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        state.total = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  clearCartError,
  setCartItems,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartItemById = (state, itemId) => 
  state.cart.items.find(item => item.id === itemId);

export default cartSlice.reducer; 