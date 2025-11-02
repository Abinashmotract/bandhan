import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import Cookies from "js-cookie";
import { searchAPI } from "../../services/apiService";

// Async thunks
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        search: filters.search || "",
        verified: filters.verified === true ? 'true' : 'false',
        nearby: filters.nearby === true ? 'true' : 'false',
        justJoined: filters.justJoined === true ? 'true' : 'false',
        ageMin: filters.ageRange && Array.isArray(filters.ageRange) ? filters.ageRange[0] : 18,
        ageMax: filters.ageRange && Array.isArray(filters.ageRange) ? filters.ageRange[1] : 60,
        religion: filters.religion || "",
        caste: filters.caste || "",
        occupation: filters.occupation || "",
        location: filters.location || "",
        sortBy: filters.sortBy || "recentlyJoined",
      };

      // Add optional filters
      if (filters.heightRange && Array.isArray(filters.heightRange)) {
        if (filters.heightRange[0]) params.heightMin = filters.heightRange[0];
        if (filters.heightRange[1]) params.heightMax = filters.heightRange[1];
      }

      if (filters.maritalStatus && Array.isArray(filters.maritalStatus) && filters.maritalStatus.length > 0) {
        params.maritalStatus = filters.maritalStatus.join(',');
      }

      if (filters.motherTongue && Array.isArray(filters.motherTongue) && filters.motherTongue.length > 0) {
        params.motherTongue = filters.motherTongue.join(',');
      }

      if (filters.education) {
        params.education = filters.education;
      }

      if (filters.annualIncome) {
        params.annualIncome = filters.annualIncome;
      }

      // Use /api/matches endpoint which has better filter support
      const response = await axios.get(`${API_BASE_URL}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

export const showInterest = createAsyncThunk(
  "matches/showInterest",
  async (profileId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/matches/interest`,
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to show interest"
      );
    }
  }
);

export const showSuperInterest = createAsyncThunk(
  "matches/showSuperInterest",
  async (profileId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/matches/super-interest`,
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to show super interest"
      );
    }
  }
);

export const getInterestLimits = createAsyncThunk(
  "matches/getInterestLimits",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/profiles/limits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch interest limits"
      );
    }
  }
);

export const searchMatches = createAsyncThunk(
  "matches/searchMatches",
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/profiles/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search matches"
      );
    }
  }
);

// Add profile to shortlist
export const addToShortlist = createAsyncThunk(
  "matches/addToShortlist",
  async (profileId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/matches/shortlist`,
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response) {
        const checkShortlist = await axios.get(
          `${API_BASE_URL}/matches/shortlist/status/${profileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (checkShortlist.data.isShortlisted) {
          return { profileId, isShortlisted: true };
        }
      }
      return { profileId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to shortlist"
      );
    }
  }
);

// Remove profile from shortlist
export const removeFromShortlist = createAsyncThunk(
  "matches/removeFromShortlist",
  async (profileId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.delete(`${API_BASE_URL}/matches/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { profileId },
      });
      return { profileId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from shortlist"
      );
    }
  }
);

// Get shortlisted profiles
export const getShortlistedProfiles = createAsyncThunk(
  "matches/getShortlistedProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/matches/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shortlisted profiles"
      );
    }
  }
);

// Check shortlist status for a profile
export const checkShortlistStatus = createAsyncThunk(
  "matches/checkShortlistStatus",
  async (profileId, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/matches/shortlist/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { profileId },
        }
      );
      return { profileId, isShortlisted: response.data.isShortlisted };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check shortlist status"
      );
    }
  }
);

// Search profiles with advanced criteria
export const searchProfilesByCriteria = createAsyncThunk(
  "matches/searchProfilesByCriteria",
  async (searchCriteria, { rejectWithValue }) => {
    try {
      const response = await searchAPI.searchProfiles(searchCriteria);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search profiles"
      );
    }
  }
);

// Save search preferences
export const saveSearchPreferences = createAsyncThunk(
  "matches/saveSearchPreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/search/preferences`,
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save search preferences"
      );
    }
  }
);

// Get search preferences
export const getSearchPreferences = createAsyncThunk(
  "matches/getSearchPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${API_BASE_URL}/search/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get search preferences"
      );
    }
  }
);

const initialState = {
  matches: [],
  filteredMatches: [],
  searchResults: [],
  searchPreferences: null,
  loading: false,
  error: null,
  shortlistedProfiles: [],
  shortlistLoading: false,
  shortlistError: null,
  interestLimits: {
    freeInterests: 5,
    freeSuperInterests: 1,
    usedInterests: 0,
    usedSuperInterests: 0,
  },
  filters: {
    verified: false,
    nearby: false,
    justJoined: false,
    ageRange: [18, 45],
    religion: "",
    caste: "",
    occupation: "",
    education: "",
    height: "",
    location: "",
  },
  searchCriteria: {
    gender: "female",
    ageMin: 21,
    ageMax: 35,
    heightMin: 122,
    heightMax: 213,
    religion: "",
    caste: "",
    education: "",
    location: "",
    occupation: "",
    annualIncome: "",
  },
  searchTerm: "",
  sortBy: "recentlyJoined",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalMatches: 0,
  },
};

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    updateShortlistStatus: (state, action) => {
      const { profileId, isShortlisted } = action.payload;
      const match = state.matches.find((m) => m._id === profileId);
      if (match) {
        match.isShortlisted = isShortlisted;
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchCriteria: (state, action) => {
      state.searchCriteria = { ...state.searchCriteria, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = "";
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSearchCriteria: (state) => {
      state.searchCriteria = initialState.searchCriteria;
    },
    applyFilters: (state) => {
      let filtered = [...state.matches];

      // Search filter
      if (state.searchTerm) {
        filtered = filtered.filter(
          (match) =>
            match.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            match.profession
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            match.location
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase())
        );
      }

      // Other filters
      if (state.filters.verified) {
        filtered = filtered.filter((match) => match.isVerified);
      }
      if (state.filters.nearby) {
        filtered = filtered.filter((match) => match.isNearby);
      }
      if (state.filters.justJoined) {
        filtered = filtered.filter((match) => match.isJustJoined);
      }
      if (state.filters.religion) {
        filtered = filtered.filter(
          (match) => match.religion === state.filters.religion
        );
      }
      if (state.filters.caste) {
        filtered = filtered.filter(
          (match) => match.caste === state.filters.caste
        );
      }
      if (state.filters.occupation) {
        filtered = filtered.filter(
          (match) => match.profession === state.filters.occupation
        );
      }
      if (state.filters.location) {
        filtered = filtered.filter((match) =>
          match.location
            .toLowerCase()
            .includes(state.filters.location.toLowerCase())
        );
      }

      // Age filter
      filtered = filtered.filter(
        (match) =>
          match.age >= state.filters.ageRange[0] &&
          match.age <= state.filters.ageRange[1]
      );

      // Sort
      switch (state.sortBy) {
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "recentlyJoined":
          filtered.sort(
            (a, b) => new Date(b.joinedDate) - new Date(a.joinedDate)
          );
          break;
        case "verified":
          filtered.sort((a, b) => b.isVerified - a.isVerified);
          break;
        case "matchScore":
          filtered.sort((a, b) => b.matchScore - a.matchScore);
          break;
        default:
          break;
      }

      state.filteredMatches = filtered;
    },
    updateMatchInterest: (state, action) => {
      const { matchId, hasShownInterest, hasShownSuperInterest } =
        action.payload;
      const match = state.matches.find((m) => m.id === matchId);
      if (match) {
        if (hasShownInterest !== undefined) {
          match.hasShownInterest = hasShownInterest;
        }
        if (hasShownSuperInterest !== undefined) {
          match.hasShownSuperInterest = hasShownSuperInterest;
        }
      }
    },
    updateInterestLimits: (state, action) => {
      state.interestLimits = { ...state.interestLimits, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.data || action.payload;
        state.filteredMatches = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Show interest
      .addCase(showInterest.pending, (state) => {
        state.loading = true;
      })
      .addCase(showInterest.fulfilled, (state, action) => {
        state.loading = false;
        const { profileId } = action.payload;
        const match = state.matches.find((m) => m.id === profileId);
        if (match) {
          match.hasShownInterest = true;
        }
        state.interestLimits.usedInterests += 1;
      })
      .addCase(showInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Show super interest
      .addCase(showSuperInterest.pending, (state) => {
        state.loading = true;
      })
      .addCase(showSuperInterest.fulfilled, (state, action) => {
        state.loading = false;
        const { profileId } = action.payload;
        const match = state.matches.find((m) => m.id === profileId);
        if (match) {
          match.hasShownSuperInterest = true;
        }
        state.interestLimits.usedSuperInterests += 1;
      })
      .addCase(showSuperInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get interest limits
      .addCase(getInterestLimits.fulfilled, (state, action) => {
        state.interestLimits = action.payload;
      })

      // Search matches
      .addCase(searchMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(searchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search profiles by criteria
      .addCase(searchProfilesByCriteria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProfilesByCriteria.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(searchProfilesByCriteria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save search preferences
      .addCase(saveSearchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSearchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.searchPreferences = action.payload.data;
      })
      .addCase(saveSearchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get search preferences
      .addCase(getSearchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.searchPreferences = action.payload.data;
        if (action.payload.data) {
          state.searchCriteria = {
            ...state.searchCriteria,
            ...action.payload.data,
          };
        }
      })
      .addCase(getSearchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setSearchTerm,
  setSortBy,
  setSearchCriteria,
  clearFilters,
  clearSearchResults,
  clearSearchCriteria,
  applyFilters,
  updateMatchInterest,
  updateInterestLimits,
  updateShortlistStatus,
} = matchesSlice.actions;

export default matchesSlice.reducer;
