import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/api';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isInitialized: false, // Add this to track if auth check is complete
};

// ----------------------
// Fetch logged-in user details
// ----------------------
export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) throw new Error('No access token found');
            const response = await axios.get(`${API_BASE_URL}/auth/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            return response.data.data; // backend ka format
        } catch (error) {
            return rejectWithValue(error.response?.message || 'Failed to fetch user details');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            const response = await axios.post(
                `${API_BASE_URL}/auth/logout`,
                { refreshToken },
                { withCredentials: true }
            );
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            return response.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Logout failed');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
            state.isInitialized = true;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.loading = false;
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            state.isInitialized = true;
        },
        clearError: (state) => {
            state.error = null;
        },
        setInitialized: (state) => {
            state.isInitialized = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchUserDetails
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isInitialized = true;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
                state.isInitialized = true;
            })

            // logoutUser
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;