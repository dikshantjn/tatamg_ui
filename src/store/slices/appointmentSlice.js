import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for booking appointment
export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching user appointments
export const fetchUserAppointments = createAsyncThunk(
  'appointment/fetchUserAppointments',
  async (userId, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/appointments/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for canceling appointment
export const cancelAppointment = createAsyncThunk(
  'appointment/cancelAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      const data = await response.json();
      return { appointmentId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for rescheduling appointment
export const rescheduleAppointment = createAsyncThunk(
  'appointment/rescheduleAppointment',
  async ({ appointmentId, newDateTime }, { rejectWithValue }) => {
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newDateTime }),
      });
      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }
      const data = await response.json();
      return { appointmentId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  appointments: [],
  currentAppointment: null,
  availableSlots: [],
  selectedDate: null,
  selectedTime: null,
  selectedDoctor: null,
  appointmentType: '',
  loading: false,
  error: null,
  bookingSuccess: false,
  filters: {
    status: 'all',
    dateRange: { start: null, end: null },
    doctorId: null,
  },
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
    },
    
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    
    setAppointmentType: (state, action) => {
      state.appointmentType = action.payload;
    },
    
    setAvailableSlots: (state, action) => {
      state.availableSlots = action.payload;
    },
    
    clearBookingForm: (state) => {
      state.selectedDate = null;
      state.selectedTime = null;
      state.selectedDoctor = null;
      state.appointmentType = '';
      state.availableSlots = [];
      state.bookingSuccess = false;
    },
    
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status } = action.payload;
      const appointment = state.appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        appointment.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
        state.bookingSuccess = true;
        state.error = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      })
      // Fetch User Appointments
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const { appointmentId } = action.payload;
        const appointment = state.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          appointment.status = 'cancelled';
        }
        state.error = null;
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reschedule Appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const { appointmentId, data } = action.payload;
        const appointment = state.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
          Object.assign(appointment, data);
        }
        state.error = null;
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentAppointment,
  clearCurrentAppointment,
  setSelectedDate,
  setSelectedTime,
  setSelectedDoctor,
  setAppointmentType,
  setAvailableSlots,
  clearBookingForm,
  setFilter,
  clearFilters,
  clearError,
  clearBookingSuccess,
  updateAppointmentStatus,
} = appointmentSlice.actions;

// Selectors
export const selectAllAppointments = (state) => state.appointment.appointments;
export const selectCurrentAppointment = (state) => state.appointment.currentAppointment;
export const selectAvailableSlots = (state) => state.appointment.availableSlots;
export const selectSelectedDate = (state) => state.appointment.selectedDate;
export const selectSelectedTime = (state) => state.appointment.selectedTime;
export const selectSelectedDoctor = (state) => state.appointment.selectedDoctor;
export const selectAppointmentType = (state) => state.appointment.appointmentType;
export const selectAppointmentLoading = (state) => state.appointment.loading;
export const selectAppointmentError = (state) => state.appointment.error;
export const selectBookingSuccess = (state) => state.appointment.bookingSuccess;
export const selectFilters = (state) => state.appointment.filters;
export const selectFilteredAppointments = (state) => {
  const { appointments, filters } = state.appointment;
  let filtered = [...appointments];
  
  if (filters.status !== 'all') {
    filtered = filtered.filter(apt => apt.status === filters.status);
  }
  
  if (filters.doctorId) {
    filtered = filtered.filter(apt => apt.doctorId === filters.doctorId);
  }
  
  if (filters.dateRange.start && filters.dateRange.end) {
    filtered = filtered.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= filters.dateRange.start && aptDate <= filters.dateRange.end;
    });
  }
  
  return filtered;
};

export default appointmentSlice.reducer; 