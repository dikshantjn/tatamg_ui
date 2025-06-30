import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: {
    id: null,
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalHistory: [],
    preferences: {},
  },
  loading: false,
  error: null,
  isProfileComplete: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isProfileComplete = checkProfileComplete(action.payload);
    },
    clearUserProfile: (state) => {
      state.profile = initialState.profile;
      state.isProfileComplete = false;
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profile[field] = value;
      state.isProfileComplete = checkProfileComplete(state.profile);
    },
    addMedicalHistory: (state, action) => {
      state.profile.medicalHistory.push(action.payload);
    },
    removeMedicalHistory: (state, action) => {
      state.profile.medicalHistory = state.profile.medicalHistory.filter(
        (item, index) => index !== action.payload
      );
    },
    updatePreferences: (state, action) => {
      state.profile.preferences = { ...state.profile.preferences, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.isProfileComplete = checkProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.isProfileComplete = checkProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Helper function to check if profile is complete
const checkProfileComplete = (profile) => {
  const requiredFields = ['name', 'email', 'phone'];
  return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
};

export const {
  setUserProfile,
  clearUserProfile,
  updateProfileField,
  addMedicalHistory,
  removeMedicalHistory,
  updatePreferences,
  clearError,
} = userSlice.actions;

export default userSlice.reducer; 