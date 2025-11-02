import React, { useState, useEffect } from "react";
import MatchesList from "./MatchesList";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Chip,
  OutlinedInput,
  Divider,
  Tabs,
  Tab,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Height as HeightIcon,
  AccountBalance as AccountBalanceIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  ArrowBackIos,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import axiosInstance from "../utils/axiosInterceptor";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";

// Mock data based on the original imports
const MARITAL_STATUS_OPTIONS = [
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
];
const RELIGION_OPTIONS = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
];
const MOTHER_TONGUE_OPTIONS = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
];
const EDUCATION_OPTIONS = [
  "High School",
  "Bachelors",
  "Masters",
  "PhD",
  "Diploma",
];
const COUNTRY_OPTIONS = ["India", "USA", "UK", "Canada", "Australia"];

// Complete list of all Indian States and Union Territories
const INDIAN_STATES = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
  // Union Territories
  { value: "andaman_and_nicobar_islands", label: "Andaman and Nicobar Islands" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "dadra_and_nagar_haveli_and_daman_and_diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "delhi", label: "Delhi" },
  { value: "jammu_and_kashmir", label: "Jammu and Kashmir" },
  { value: "ladakh", label: "Ladakh" },
  { value: "lakshadweep", label: "Lakshadweep" },
  { value: "puducherry", label: "Puducherry" },
];

const STATE_OPTIONS = INDIAN_STATES;
const COMPREHENSIVE_INDUSTRY_OPTIONS = [
  { value: "it", label: "Information Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "engineering", label: "Engineering" },
];
const HEIGHT_OPTIONS = [
  { value: "140", label: "4'7\" (140 cm)" },
  { value: "150", label: "4'11\" (150 cm)" },
  { value: "160", label: "5'3\" (160 cm)" },
  { value: "170", label: "5'7\" (170 cm)" },
  { value: "180", label: "5'11\" (180 cm)" },
  { value: "190", label: "6'3\" (190 cm)" },
];
const AGE_OPTIONS = [
  { value: "18", label: "18" },
  { value: "21", label: "21" },
  { value: "25", label: "25" },
  { value: "30", label: "30" },
  { value: "35", label: "35" },
  { value: "40", label: "40" },
  { value: "45", label: "45" },
  { value: "50", label: "50" },
];

const getCasteOptions = (religion) => {
  const casteMap = {
    hindu: [
      { value: "brahmin", label: "Brahmin" },
      { value: "kshatriya", label: "Kshatriya" },
      { value: "vaishya", label: "Vaishya" },
    ],
    muslim: [
      { value: "sunni", label: "Sunni" },
      { value: "shia", label: "Shia" },
    ],
  };
  return casteMap[religion] || [];
};

const getSubCasteOptions = (religion, caste) => {
  return [];
};

const getCityOptions = (state) => {
  const cityMap = {
    maharashtra: [
      { value: "mumbai", label: "Mumbai" },
      { value: "pune", label: "Pune" },
    ],
    delhi: [{ value: "new_delhi", label: "New Delhi" }],
  };
  return cityMap[state] || [];
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  const panelType = index === 0 ? "criteria" : "profile";
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-${panelType}-panel`}
      aria-labelledby={`search-${panelType}-tab`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const searchDate = new Date(date);
  const diffInMs = now - searchDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) return "Searched just now";
  if (diffInHours < 24) return `Searched ${diffInHours} hours ago`;
  if (diffInDays === 1) return "Searched 1 day ago";
  return `Searched ${diffInDays} days ago`;
};

// Helper function to get height label
const getHeightLabel = (heightValue) => {
  const height = HEIGHT_OPTIONS.find((h) => h.value === heightValue);
  return height ? height.label : heightValue;
};

const getAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const getHeight = (height) => {
  if (!height) return null;
  console.log(height);
  return height;
};

const SearchForm = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [savingSearch, setSavingSearch] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    ageMin: "",
    ageMax: "",
    heightMin: "",
    heightMax: "",
    maritalStatus: [],
    religion: "",
    caste: "",
    subCaste: "",
    country: "",
    state: "",
    city: "",
    motherTongue: [],
    education: "",
    occupation: [],
    profileId: "",
  });
  const navigate = useNavigate();
  const [availableCastes, setAvailableCastes] = useState([]);
  const [availableSubCastes, setAvailableSubCastes] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const onCriteriaChange = (field, value) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update dependent options when religion changes
  useEffect(() => {
    if (searchCriteria.religion) {
      const castes = getCasteOptions(searchCriteria.religion);
      setAvailableCastes(castes);
      onCriteriaChange("caste", "");
      onCriteriaChange("subCaste", "");
    } else {
      setAvailableCastes([]);
      setAvailableSubCastes([]);
    }
  }, [searchCriteria.religion]);

  // Update subcaste options when caste changes
  useEffect(() => {
    if (searchCriteria.religion && searchCriteria.caste) {
      const subCastes = getSubCasteOptions(
        searchCriteria.religion,
        searchCriteria.caste
      );
      setAvailableSubCastes(subCastes);
      onCriteriaChange("subCaste", "");
    } else {
      setAvailableSubCastes([]);
    }
  }, [searchCriteria.caste, searchCriteria.religion]);

  // Update city options when state changes
  useEffect(() => {
    if (searchCriteria.state) {
      const cities = getCityOptions(searchCriteria.state);
      setAvailableCities(cities);
      onCriteriaChange("city", "");
    } else {
      setAvailableCities([]);
    }
  }, [searchCriteria.state]);

  const handleMultipleSelectChange = (field, value) => {
    onCriteriaChange(field, value);
  };

  // Auto-save search function
  const autoSaveSearch = async (criteria) => {
    try {
      // Only save if there are actual search criteria
      const hasSearchCriteria =
        criteria.ageMin ||
        criteria.ageMax ||
        criteria.heightMin ||
        criteria.heightMax ||
        criteria.maritalStatus?.length > 0 ||
        criteria.religion ||
        criteria.motherTongue?.length > 0 ||
        criteria.country ||
        criteria.state ||
        criteria.city ||
        criteria.education ||
        criteria.occupation?.length > 0;

      if (!hasSearchCriteria) return;

      await axiosInstance.post("/search/save-filter", {
        filters: criteria,
        name: `Search ${new Date().toLocaleDateString()}`,
      });

      // Refresh saved searches list
      loadSavedSearches();
    } catch (error) {
      console.error("Error auto-saving search:", error);
      // Silent fail - don't show error to user for auto-save
    }
  };

  const onSearch = async () => {
    setLoading(true);
    try {
      let response;

      if (tabIndex === 0) {
        // Search by Criteria
        response = await axiosInstance.post(
          "/search/by-criteria",
          searchCriteria
        );
      } else {
        // Search by Profile ID
        if (!searchCriteria.profileId) {
          showError("Please enter a Profile ID");
          setLoading(false);
          return;
        }
        response = await axiosInstance.get(
          `/search/by-profile-id/${searchCriteria.profileId}`
        );
      }

      console.log(response.data);
      if (response.data.success) {
        // For profile ID search, wrap single profile in array if needed
        const results =
          tabIndex === 1 && !Array.isArray(response.data.data)
            ? [response.data.data]
            : response.data.data;

        setSearchResults(results);
        setShowResults(true);

        // Auto-save only for criteria search
        if (tabIndex === 0) {
          await autoSaveSearch(searchCriteria);
        }
      } else {
        showError(response.data.message || "No results found");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to search");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onResetCriteria = () => {
    setSearchCriteria({
      ageMin: "",
      ageMax: "",
      heightMin: "",
      heightMax: "",
      maritalStatus: [],
      religion: "",
      caste: "",
      subCaste: "",
      country: "",
      state: "",
      city: "",
      motherTongue: [],
      education: "",
      occupation: [],
      profileId: "",
    });
  };

  // Load saved searches
  const loadSavedSearches = async () => {
    setLoadingSaved(true);
    try {
      const response = await axiosInstance.get("/search/saved-searches");
      if (response.data.success) {
        setSavedSearches(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load saved searches:", error);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Load a saved search
  const loadSavedSearch = async (searchId) => {
    try {
      const response = await axiosInstance.get(
        `/search/saved-search/${searchId}`
      );
      if (response.data.success) {
        const { filters } = response.data.data;
        setSearchCriteria({
          ageMin: filters.ageRange?.min || "",
          ageMax: filters.ageRange?.max || "",
          heightMin: filters.heightRange?.min || "",
          heightMax: filters.heightRange?.max || "",
          maritalStatus: filters.maritalStatus || [],
          religion: filters.religion?.[0] || "",
          caste: filters.caste?.[0] || "",
          motherTongue: filters.motherTongue || [],
          country: filters.country?.[0] || "",
          state: filters.state?.[0] || "",
          city: filters.city?.[0] || "",
          education: filters.education?.[0] || "",
          occupation: filters.occupation || [],
        });
        showSuccess("Search loaded successfully");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to load saved search");
    }
  };

  // Delete a saved search
  const deleteSavedSearch = async (searchId, e) => {
    e.stopPropagation(); // Prevent triggering load when clicking delete
    try {
      const response = await axiosInstance.delete(
        `/search/saved-search/${searchId}`
      );
      if (response.data.success) {
        showSuccess("Search deleted successfully");
        loadSavedSearches(); // Refresh the list
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to delete saved search"
      );
    }
  };

  // Load saved searches on component mount
  useEffect(() => {
    loadSavedSearches();
  }, []);

  // Render saved search criteria details
  const renderSearchDetails = (filters) => {
    const details = [];

    // Age
    if (filters.ageRange?.min || filters.ageRange?.max) {
      const ageText = `${filters.ageRange?.min || "0"} to ${
        filters.ageRange?.max || "99"
      }`;
      details.push(ageText);
    }

    // Height
    if (filters.heightRange?.min || filters.heightRange?.max) {
      const heightMin = filters.heightRange?.min
        ? getHeightLabel(filters.heightRange.min)
        : "";
      const heightMax = filters.heightRange?.max
        ? getHeightLabel(filters.heightRange.max)
        : "";
      if (heightMin && heightMax) {
        details.push(`${heightMin} to ${heightMax}`);
      }
    }

    // Income
    if (filters.incomeRange?.min || filters.incomeRange?.max) {
      const incomeText = `Rs.${filters.incomeRange?.min || "0"} Lakh to Rs.${
        filters.incomeRange?.max || "0"
      } Lakh`;
      details.push(incomeText);
    }

    // Marital Status
    if (filters.maritalStatus?.length > 0) {
      details.push(...filters.maritalStatus);
    }

    // Religion
    if (filters.religion?.length > 0) {
      details.push(...filters.religion);
    }
    console.log(details);
    return details;
  };

  const goBack = () => {
    setShowResults(false);
    onResetCriteria();
  };

  return (
    <Box sx={{ mx: "auto", p: 2 }}>
      {showResults ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ArrowBackIos
              onClick={goBack}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                color: "#51375f",
                margin: " 0 10px 0 0",
                fontWeight: "900",
              }}
            />

            <Typography
              variant="h5"
              sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.1rem" }}
            >
              Search Results
            </Typography>
          </Box>
          <MatchesList
            filteredMatches={searchResults}
            loading={loading}
            error={null}
            getAge={getAge}
            getHeight={getHeight}
            filters={{}}
            onFilterChange={() => {}}
            onSearchClick={() => {}}
          />
        </>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="search options"
              sx={{
                minHeight: "48px",
                "& .MuiTab-root": {
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textTransform: "none",
                  minHeight: "48px",
                  flex: 1,
                  color: "#666",
                },
                "& .Mui-selected": {
                  color: "#d63384 !important",
                  fontWeight: 600,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#d63384",
                  height: 2,
                },
              }}
            >
              <Tab
                label="Search by Criteria"
                id="search-criteria-tab"
                aria-controls="search-criteria-panel"
              />
              <Tab
                label="Search by Profile ID"
                id="search-profile-tab"
                aria-controls="search-profile-panel"
              />
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <Typography
              variant="h5"
              sx={{
                color: "#d63384",
                fontWeight: 600,
                mb: 3,
                fontSize: "1.1rem",
              }}
            >
              Search by Criteria
            </Typography>

            {/* Recent Searches Section */}
            {savedSearches.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    mb: 2,
                    color: "#333",
                  }}
                >
                  Recent searches
                </Typography>

                <Grid container spacing={2}>
                  {savedSearches.slice(0, 4).map((search) => {
                    const details = renderSearchDetails(search.filters);
                    return (
                      <Grid item xs={12} sm={6} key={search._id}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              boxShadow: 3,
                              transform: "translateY(-2px)",
                            },
                            position: "relative",
                          }}
                          onClick={() => loadSavedSearch(search._id)}
                        >
                          <CardContent sx={{ pb: "16px !important" }}>
                            {/* Delete Button */}
                            <IconButton
                              size="small"
                              onClick={(e) => deleteSavedSearch(search._id, e)}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                color: "#999",
                                "&:hover": {
                                  color: "#d63384",
                                  backgroundColor: "#fee",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                            {/* Time stamp with icon */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1.5,
                                color: "#666",
                              }}
                            >
                              <HistoryIcon
                                sx={{ fontSize: 16, mr: 0.5, color: "#999" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {formatTimeAgo(
                                  search.lastUsed || search.createdAt
                                )}
                              </Typography>
                            </Box>

                            {/* Search Details */}
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                pr: 4, // Make room for delete button
                              }}
                            >
                              {details.slice(0, 4).map((detail, index) => (
                                <Chip
                                  key={index}
                                  label={detail}
                                  size="small"
                                  sx={{
                                    fontSize: "0.75rem",
                                    height: 24,
                                    backgroundColor: "#f5f5f5",
                                    border: "1px solid #e0e0e0",
                                  }}
                                />
                              ))}
                              {details.length > 4 && (
                                <Chip
                                  label={`+${details.length - 4} More`}
                                  size="small"
                                  sx={{
                                    fontSize: "0.75rem",
                                    height: 24,
                                    backgroundColor: "#d63384",
                                    color: "white",
                                    fontWeight: 500,
                                  }}
                                />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                <Divider sx={{ mt: 3, mb: 2 }} />
              </Box>
            )}

            <Box>
              {/* Search Form */}
              <Box sx={{ px: 2.5 }}>
                <Stack spacing={2.5}>
                  {/* Age */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Age
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={searchCriteria.ageMin || ""}
                          onChange={(e) =>
                            onCriteriaChange("ageMin", e.target.value)
                          }
                          displayEmpty
                          sx={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                            Min Age
                          </MenuItem>
                          {AGE_OPTIONS?.map((age) => (
                            <MenuItem
                              key={age.value}
                              value={age.value}
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {age.label} Years
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography
                        sx={{
                          alignSelf: "center",
                          color: "#999",
                          fontSize: "0.875rem",
                        }}
                      >
                        to
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={searchCriteria.ageMax || ""}
                          onChange={(e) =>
                            onCriteriaChange("ageMax", e.target.value)
                          }
                          displayEmpty
                          sx={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                            Max Age
                          </MenuItem>
                          {AGE_OPTIONS.map((age) => (
                            <MenuItem
                              key={age.value}
                              value={age.value}
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {age.label} Years
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>

                  {/* Height */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Height
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={searchCriteria.heightMin || ""}
                          onChange={(e) =>
                            onCriteriaChange("heightMin", e.target.value)
                          }
                          displayEmpty
                          sx={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                            Min Height
                          </MenuItem>
                          {HEIGHT_OPTIONS.map((height) => (
                            <MenuItem
                              key={height.value}
                              value={height.value}
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {height.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Typography
                        sx={{
                          alignSelf: "center",
                          color: "#999",
                          fontSize: "0.875rem",
                        }}
                      >
                        to
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={searchCriteria.heightMax || ""}
                          onChange={(e) =>
                            onCriteriaChange("heightMax", e.target.value)
                          }
                          displayEmpty
                          sx={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                            Max Height
                          </MenuItem>
                          {HEIGHT_OPTIONS.map((height) => (
                            <MenuItem
                              key={height.value}
                              value={height.value}
                              sx={{ fontSize: "0.875rem" }}
                            >
                              {height.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>

                  {/* Marital Status */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Marital Status
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={searchCriteria.maritalStatus || []}
                        onChange={(e) =>
                          handleMultipleSelectChange(
                            "maritalStatus",
                            e.target.value
                          )
                        }
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Typography
                                sx={{ color: "#999", fontSize: "0.875rem" }}
                              >
                                Select Marital Status
                              </Typography>
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  size="small"
                                  sx={{ height: 24, fontSize: "0.75rem" }}
                                />
                              ))}
                            </Box>
                          );
                        }}
                        MenuProps={MenuProps}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {MOTHER_TONGUE_OPTIONS.map((language) => (
                          <MenuItem
                            key={language}
                            value={language}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            <Checkbox
                              checked={searchCriteria.motherTongue?.includes(
                                language
                              )}
                              size="small"
                              sx={{ py: 0 }}
                            />
                            {language}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Country */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Country
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={searchCriteria.country || ""}
                        onChange={(e) =>
                          onCriteriaChange("country", e.target.value)
                        }
                        displayEmpty
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                          Doesn't Matter
                        </MenuItem>
                        {COUNTRY_OPTIONS.map((country) => (
                          <MenuItem
                            key={country}
                            value={country}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* State */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      State
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={searchCriteria.state || ""}
                        onChange={(e) =>
                          onCriteriaChange("state", e.target.value)
                        }
                        displayEmpty
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                          Doesn't Matter
                        </MenuItem>
                        {STATE_OPTIONS.map((state) => (
                          <MenuItem
                            key={state.value}
                            value={state.value}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {state.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* City */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      City
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={searchCriteria.city || ""}
                        onChange={(e) =>
                          onCriteriaChange("city", e.target.value)
                        }
                        disabled={!searchCriteria.state}
                        displayEmpty
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                          Doesn't Matter
                        </MenuItem>
                        {availableCities.map((city) => (
                          <MenuItem
                            key={city.value}
                            value={city.value}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {city.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Education */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Education
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={searchCriteria.education || ""}
                        onChange={(e) =>
                          onCriteriaChange("education", e.target.value)
                        }
                        displayEmpty
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                          Doesn't Matter
                        </MenuItem>
                        {EDUCATION_OPTIONS.map((education) => (
                          <MenuItem
                            key={education}
                            value={education.toLowerCase().replace(" ", "_")}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {education}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Occupation */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#333",
                        fontWeight: 500,
                        mb: 1,
                        fontSize: "0.875rem",
                      }}
                    >
                      Occupation
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={searchCriteria.occupation || []}
                        onChange={(e) =>
                          handleMultipleSelectChange(
                            "occupation",
                            e.target.value
                          )
                        }
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <Typography
                                sx={{ color: "#999", fontSize: "0.875rem" }}
                              >
                                Select Occupation
                              </Typography>
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value) => {
                                const option =
                                  COMPREHENSIVE_INDUSTRY_OPTIONS.find(
                                    (opt) => opt.value === value
                                  );
                                return (
                                  <Chip
                                    key={value}
                                    label={option?.label || value}
                                    size="small"
                                    sx={{ height: 24, fontSize: "0.75rem" }}
                                  />
                                );
                              })}
                            </Box>
                          );
                        }}
                        MenuProps={MenuProps}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {COMPREHENSIVE_INDUSTRY_OPTIONS.map((industry) => (
                          <MenuItem
                            key={industry.value}
                            value={industry.value}
                            sx={{ fontSize: "0.875rem" }}
                          >
                            <Checkbox
                              checked={searchCriteria.occupation?.includes(
                                industry.value
                              )}
                              size="small"
                              sx={{ py: 0 }}
                            />
                            {industry.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Box sx={{ px: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter Profile ID (e.g., PROFILE12345)"
                value={searchCriteria.profileId || ""}
                onChange={(e) => onCriteriaChange("profileId", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.875rem",
                    "&:hover fieldset": {
                      borderColor: "#d63384",
                    },
                  },
                }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 1, display: "block", fontSize: "0.75rem" }}
              >
                Enter the specific profile ID to search for a particular user
              </Typography>
            </Box>
          </TabPanel>
          <Divider sx={{ mt: 3, mb: 2 }} />

          {/* Action Buttons */}
          <Box sx={{ p: 2.5, textAlign: "center" }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
              onClick={onSearch}
              disabled={loading}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                background: "#d63384",
                fontWeight: 600,
                fontSize: "0.9rem",
                py: 1,
                boxShadow: "none",
                "&:hover": {
                  background: "#c1286e",
                  boxShadow: "none",
                },
              }}
            >
              Show Profiles
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={onResetCriteria}
              sx={{
                mt: 1,
                textTransform: "none",
                color: "#666",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  background: "transparent",
                  color: "#d63384",
                },
              }}
            >
              Reset All Filters
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SearchForm;
