import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Search as SearchIcon,
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
} from "@mui/icons-material";

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
const STATE_OPTIONS = [
  { value: "maharashtra", label: "Maharashtra" },
  { value: "delhi", label: "Delhi" },
  { value: "karnataka", label: "Karnataka" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
];
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
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SearchForm = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const onSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Search criteria:", searchCriteria);
    }, 1000);
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

  return (
    <Box sx={{  mx: "auto", p: 2 }}>
      <Typography
        variant="h5"
        sx={{ color: "#d63384", fontWeight: 600, mb: 3, fontSize: "1.1rem" }}
      >
        Search by Criteria
      </Typography>

      <Box
       
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
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
            variant="fullWidth"
          >
            <Tab label="Search by Criteria" />
            <Tab label="Search by Profile ID" />
          </Tabs>
        </Box>

        {/* Tab 1: Search by Criteria */}
        <TabPanel value={tabIndex} index={0}>
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
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        <Checkbox
                          checked={
                            searchCriteria.maritalStatus?.indexOf(status) > -1
                          }
                          size="small"
                          sx={{ py: 0 }}
                        />
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Religion */}
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
                  Religion
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchCriteria.religion || ""}
                    onChange={(e) =>
                      onCriteriaChange("religion", e.target.value)
                    }
                    displayEmpty
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                      Doesn't Matter
                    </MenuItem>
                    {RELIGION_OPTIONS.map((religion) => (
                      <MenuItem
                        key={religion}
                        value={religion.toLowerCase()}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {religion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Caste */}
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
                  Caste
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={searchCriteria.caste || ""}
                    onChange={(e) => onCriteriaChange("caste", e.target.value)}
                    disabled={!searchCriteria.religion}
                    displayEmpty
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                      Doesn't Matter
                    </MenuItem>
                    {availableCastes.map((caste) => (
                      <MenuItem
                        key={caste.value}
                        value={caste.value}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {caste.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Mother Tongue */}
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
                  Mother Tongue
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={searchCriteria.motherTongue || []}
                    onChange={(e) =>
                      handleMultipleSelectChange("motherTongue", e.target.value)
                    }
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <Typography
                            sx={{ color: "#999", fontSize: "0.875rem" }}
                          >
                            Select Mother Tongue
                          </Typography>
                        );
                      }
                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
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
                          checked={
                            searchCriteria.motherTongue?.indexOf(language) > -1
                          }
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
                    onChange={(e) => onCriteriaChange("state", e.target.value)}
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
                    onChange={(e) => onCriteriaChange("city", e.target.value)}
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
                      handleMultipleSelectChange("occupation", e.target.value)
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
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const option = COMPREHENSIVE_INDUSTRY_OPTIONS.find(
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
                          checked={
                            searchCriteria.occupation?.indexOf(industry.value) >
                            -1
                          }
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
        </TabPanel>

        {/* Tab 2: Search by Profile ID */}
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

        <Divider sx={{ mt: 2 }} />

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
      </Box>
    </Box>
  );
};

export default SearchForm;
