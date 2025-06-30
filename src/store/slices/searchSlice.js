import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for performing search
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });
      
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      return { query, results: data, filters };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching search suggestions
export const fetchSearchSuggestions = createAsyncThunk(
  'search/fetchSearchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  query: '',
  results: [],
  suggestions: [],
  searchHistory: [],
  recentSearches: [],
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    location: '',
    rating: 0,
    availability: 'all',
    specialization: '',
  },
  loading: false,
  error: null,
  hasSearched: false,
  totalResults: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    
    clearQuery: (state) => {
      state.query = '';
    },
    
    setResults: (state, action) => {
      state.results = action.payload;
      state.hasSearched = true;
    },
    
    clearResults: (state) => {
      state.results = [];
      state.hasSearched = false;
      state.totalResults = 0;
    },
    
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    
    addToSearchHistory: (state, action) => {
      const searchTerm = action.payload;
      // Remove if already exists
      state.searchHistory = state.searchHistory.filter(term => term !== searchTerm);
      // Add to beginning
      state.searchHistory.unshift(searchTerm);
      // Keep only last 10 searches
      state.searchHistory = state.searchHistory.slice(0, 10);
    },
    
    addToRecentSearches: (state, action) => {
      const searchData = action.payload;
      // Remove if already exists
      state.recentSearches = state.recentSearches.filter(
        search => search.query !== searchData.query
      );
      // Add to beginning
      state.recentSearches.unshift({
        ...searchData,
        timestamp: new Date().toISOString(),
      });
      // Keep only last 5 searches
      state.recentSearches = state.recentSearches.slice(0, 5);
    },
    
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetSearch: (state) => {
      state.query = '';
      state.results = [];
      state.suggestions = [];
      state.hasSearched = false;
      state.totalResults = 0;
      state.currentPage = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Perform Search
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        const { query, results, filters } = action.payload;
        state.results = results;
        state.totalResults = results.length;
        state.hasSearched = true;
        state.filters = { ...state.filters, ...filters };
        state.error = null;
        
        // Add to search history
        if (query.trim()) {
          state.searchHistory = state.searchHistory.filter(term => term !== query);
          state.searchHistory.unshift(query);
          state.searchHistory = state.searchHistory.slice(0, 10);
        }
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Search Suggestions
      .addCase(fetchSearchSuggestions.pending, (state) => {
        // Don't set loading to true for suggestions to avoid UI blocking
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.suggestions = [];
        // Don't set error for suggestions
      });
  },
});

export const {
  setQuery,
  clearQuery,
  setResults,
  clearResults,
  setSuggestions,
  clearSuggestions,
  addToSearchHistory,
  addToRecentSearches,
  clearSearchHistory,
  clearRecentSearches,
  setFilter,
  clearFilters,
  setPage,
  setItemsPerPage,
  clearError,
  resetSearch,
} = searchSlice.actions;

// Selectors
export const selectQuery = (state) => state.search.query;
export const selectResults = (state) => state.search.results;
export const selectSuggestions = (state) => state.search.suggestions;
export const selectSearchHistory = (state) => state.search.searchHistory;
export const selectRecentSearches = (state) => state.search.recentSearches;
export const selectFilters = (state) => state.search.filters;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectHasSearched = (state) => state.search.hasSearched;
export const selectTotalResults = (state) => state.search.totalResults;
export const selectCurrentPage = (state) => state.search.currentPage;
export const selectItemsPerPage = (state) => state.search.itemsPerPage;
export const selectPaginatedResults = (state) => {
  const { results, currentPage, itemsPerPage } = state.search;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return results.slice(startIndex, endIndex);
};

export default searchSlice.reducer; 