import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/products/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }
      const data = await response.json();
      return { category, products: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  filteredProducts: [],
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      state.pagination.currentPage = 1; // Reset to first page when filter changes
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.products;
      state.pagination.currentPage = 1;
    },
    
    applyFilters: (state) => {
      let filtered = [...state.products];
      
      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(product => 
          product.category === state.filters.category
        );
      }
      
      // Apply price range filter
      filtered = filtered.filter(product => 
        product.price >= state.filters.priceRange.min && 
        product.price <= state.filters.priceRange.max
      );
      
      // Apply search term filter
      if (state.filters.searchTerm) {
        const searchTerm = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[state.filters.sortBy];
        const bValue = b[state.filters.sortBy];
        
        if (state.filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      state.filteredProducts = filtered;
      state.pagination.totalItems = filtered.length;
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.itemsPerPage);
    },
    
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.totalPages = Math.ceil(state.pagination.totalItems / action.payload);
      state.pagination.currentPage = 1;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.filteredProducts = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.pagination.totalItems = action.payload.products.length;
        state.pagination.totalPages = Math.ceil(action.payload.products.length / state.pagination.itemsPerPage);
        state.error = null;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setProducts,
  setCurrentProduct,
  clearCurrentProduct,
  setCategories,
  setFilter,
  clearFilters,
  applyFilters,
  setPage,
  setItemsPerPage,
  clearError,
} = productSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.product.products;
export const selectFilteredProducts = (state) => state.product.filteredProducts;
export const selectCurrentProduct = (state) => state.product.currentProduct;
export const selectCategories = (state) => state.product.categories;
export const selectFilters = (state) => state.product.filters;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectPagination = (state) => state.product.pagination;
export const selectCurrentPageProducts = (state) => {
  const { currentPage, itemsPerPage } = state.product.pagination;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return state.product.filteredProducts.slice(startIndex, endIndex);
};

export default productSlice.reducer; 