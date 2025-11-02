import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slider,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";

const FilterDialog = ({ open, onClose, onApply, filters = {} }) => {
  const user = useSelector((state) => state.auth.user);
  const [activeCategory, setActiveCategory] = useState("typeOfMatches");
  const [localFilters, setLocalFilters] = useState({
    typeOfMatch: "all", // all, verified, justJoined, nearbyMe
    ageRange: [18, 60],
    heightRange: ["", ""],
    maritalStatus: [],
    religion: "",
    caste: "",
    motherTongue: [],
    education: "",
    occupation: "",
    location: "",
    annualIncome: "",
    ...filters,
  });

  useEffect(() => {
    if (open) {
      // Initialize filters from props, including typeOfMatch from verified/justJoined/nearby
      let typeOfMatch = "all";
      if (filters.nearby === true) typeOfMatch = "nearbyMe";
      else if (filters.justJoined === true) typeOfMatch = "justJoined";
      else if (filters.verified === true) typeOfMatch = "verified";

      setLocalFilters({
        typeOfMatch,
        ageRange: filters.ageRange || [18, 60],
        heightRange: filters.heightRange || ["", ""],
        maritalStatus: filters.maritalStatus || [],
        religion: filters.religion || "",
        caste: filters.caste || "",
        motherTongue: filters.motherTongue || [],
        education: filters.education || "",
        occupation: filters.occupation || "",
        location: filters.location || "",
        annualIncome: filters.annualIncome || "",
      });
    }
  }, [open, filters]);

  const filterCategories = [
    { id: "typeOfMatches", label: "Type of Matches" },
    { id: "familyBasedOutOf", label: "Family based out of", locked: true },
    { id: "profilePostedBy", label: "Profile posted by", locked: true },
    { id: "activityOnSite", label: "Activity on site", locked: true },
    { id: "religion", label: "Religion" },
    { id: "motherTongue", label: "Mother Tongue" },
    { id: "casteGroup", label: "Caste Group" },
    { id: "casteSubcaste", label: "Caste Subcaste" },
    { id: "country", label: "Country" },
    { id: "city", label: "City" },
    { id: "income", label: "Income" },
    { id: "age", label: "Age" },
    { id: "height", label: "Height" },
    { id: "education", label: "Education" },
    { id: "occupation", label: "Occupation" },
    { id: "maritalStatus", label: "Marital Status" },
  ];

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

  const OCCUPATION_OPTIONS = [
    "Private Job",
    "Government Job",
    "Business",
    "Not Working",
    "Student",
  ];

  const INCOME_OPTIONS = [
    "Below 1 Lakh",
    "1-3 LPA",
    "3-5 LPA",
    "5-10 LPA",
    "10-15 LPA",
    "15-25 LPA",
    "25+ LPA",
  ];

  const COUNTRY_OPTIONS = ["India", "USA", "UK", "Canada", "Australia"];

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleClear = (field) => {
    if (field === "ageRange") {
      setLocalFilters((prev) => ({ ...prev, [field]: [18, 60] }));
    } else if (Array.isArray(localFilters[field])) {
      setLocalFilters((prev) => ({ ...prev, [field]: [] }));
    } else {
      setLocalFilters((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleReset = () => {
    setLocalFilters({
      typeOfMatch: "all",
      ageRange: [18, 60],
      heightRange: ["", ""],
      maritalStatus: [],
      religion: "",
      caste: "",
      motherTongue: [],
      education: "",
      occupation: "",
      location: "",
      annualIncome: "",
    });
  };

  const handleApply = () => {
    // Map typeOfMatch to verified/justJoined/nearby
    const updatedFilters = {
      ...localFilters,
      verified: localFilters.typeOfMatch === "verified",
      justJoined: localFilters.typeOfMatch === "justJoined",
      nearby: localFilters.typeOfMatch === "nearbyMe",
    };
    delete updatedFilters.typeOfMatch;
    onApply(updatedFilters);
    onClose();
  };

  const renderFilterContent = () => {
    switch (activeCategory) {
      case "typeOfMatches":
        return (
          <Box>
            <RadioGroup
              value={localFilters.typeOfMatch}
              onChange={(e) => handleChange("typeOfMatch", e.target.value)}
            >
              <FormControlLabel
                value="all"
                control={<Radio sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }} />}
                label="All"
              />
              <FormControlLabel
                value="verified"
                control={<Radio sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }} />}
                label="Verified"
              />
              <FormControlLabel
                value="justJoined"
                control={<Radio sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }} />}
                label="Just Joined"
              />
              <FormControlLabel
                value="nearbyMe"
                control={<Radio sx={{ color: "#dc2626", "&.Mui-checked": { color: "#dc2626" } }} />}
                label="Nearby Me"
              />
            </RadioGroup>
            {localFilters.typeOfMatch === "nearbyMe" && user?.location && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing profiles near your location: <strong>{user.location}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        );

      case "religion":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select
                value={localFilters.religion}
                onChange={(e) => handleChange("religion", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Any</MenuItem>
                {RELIGION_OPTIONS.map((religion) => (
                  <MenuItem key={religion} value={religion.toLowerCase()}>
                    {religion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {localFilters.religion && (
              <Button
                size="small"
                onClick={() => handleClear("religion")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "motherTongue":
        return (
          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {MOTHER_TONGUE_OPTIONS.map((tongue) => (
                <Chip
                  key={tongue}
                  label={tongue}
                  onClick={() => handleMultiSelectChange("motherTongue", tongue.toLowerCase())}
                  color={localFilters.motherTongue.includes(tongue.toLowerCase()) ? "error" : "default"}
                  variant={localFilters.motherTongue.includes(tongue.toLowerCase()) ? "filled" : "outlined"}
                />
              ))}
            </Box>
            {localFilters.motherTongue.length > 0 && (
              <Button
                size="small"
                onClick={() => handleClear("motherTongue")}
                sx={{ mt: 2, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "casteGroup":
        return (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter caste group"
              value={localFilters.caste}
              onChange={(e) => handleChange("caste", e.target.value)}
            />
            {localFilters.caste && (
              <Button
                size="small"
                onClick={() => handleClear("caste")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "casteSubcaste":
        return (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter subcaste"
              value={localFilters.caste}
              onChange={(e) => handleChange("caste", e.target.value)}
            />
            {localFilters.caste && (
              <Button
                size="small"
                onClick={() => handleClear("caste")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "country":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select
                value={localFilters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Any</MenuItem>
                {COUNTRY_OPTIONS.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {localFilters.location && (
              <Button
                size="small"
                onClick={() => handleClear("location")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "city":
        return (
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter city"
              value={localFilters.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            {localFilters.location && (
              <Button
                size="small"
                onClick={() => handleClear("location")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "income":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select
                value={localFilters.annualIncome}
                onChange={(e) => handleChange("annualIncome", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Any</MenuItem>
                {INCOME_OPTIONS.map((income) => (
                  <MenuItem key={income} value={income.toLowerCase().replace(" ", "_")}>
                    {income}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {localFilters.annualIncome && (
              <Button
                size="small"
                onClick={() => handleClear("annualIncome")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "age":
        return (
          <Box>
            <Box sx={{ px: 2 }}>
              <Slider
                value={localFilters.ageRange}
                onChange={(e, newValue) => handleChange("ageRange", newValue)}
                valueLabelDisplay="on"
                min={18}
                max={60}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {localFilters.ageRange[0]} years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {localFilters.ageRange[1]} years
                </Typography>
              </Box>
            </Box>
            {(localFilters.ageRange[0] !== 18 || localFilters.ageRange[1] !== 60) && (
              <Button
                size="small"
                onClick={() => handleClear("ageRange")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "height":
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Min Height</InputLabel>
                  <Select
                    value={localFilters.heightRange[0] || ""}
                    label="Min Height"
                    onChange={(e) =>
                      handleChange("heightRange", [
                        e.target.value,
                        localFilters.heightRange[1],
                      ])
                    }
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="4ft_6in">4'6"</MenuItem>
                    <MenuItem value="4ft_7in">4'7"</MenuItem>
                    <MenuItem value="4ft_8in">4'8"</MenuItem>
                    <MenuItem value="4ft_9in">4'9"</MenuItem>
                    <MenuItem value="4ft_10in">4'10"</MenuItem>
                    <MenuItem value="4ft_11in">4'11"</MenuItem>
                    <MenuItem value="5ft">5'0"</MenuItem>
                    <MenuItem value="5ft_1in">5'1"</MenuItem>
                    <MenuItem value="5ft_2in">5'2"</MenuItem>
                    <MenuItem value="5ft_3in">5'3"</MenuItem>
                    <MenuItem value="5ft_4in">5'4"</MenuItem>
                    <MenuItem value="5ft_5in">5'5"</MenuItem>
                    <MenuItem value="5ft_6in">5'6"</MenuItem>
                    <MenuItem value="5ft_7in">5'7"</MenuItem>
                    <MenuItem value="5ft_8in">5'8"</MenuItem>
                    <MenuItem value="5ft_9in">5'9"</MenuItem>
                    <MenuItem value="5ft_10in">5'10"</MenuItem>
                    <MenuItem value="5ft_11in">5'11"</MenuItem>
                    <MenuItem value="6ft">6'0"</MenuItem>
                    <MenuItem value="6ft_1in">6'1"</MenuItem>
                    <MenuItem value="6ft_2in">6'2"</MenuItem>
                    <MenuItem value="6ft_3in">6'3"</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Max Height</InputLabel>
                  <Select
                    value={localFilters.heightRange[1] || ""}
                    label="Max Height"
                    onChange={(e) =>
                      handleChange("heightRange", [
                        localFilters.heightRange[0],
                        e.target.value,
                      ])
                    }
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="4ft_6in">4'6"</MenuItem>
                    <MenuItem value="4ft_7in">4'7"</MenuItem>
                    <MenuItem value="4ft_8in">4'8"</MenuItem>
                    <MenuItem value="4ft_9in">4'9"</MenuItem>
                    <MenuItem value="4ft_10in">4'10"</MenuItem>
                    <MenuItem value="4ft_11in">4'11"</MenuItem>
                    <MenuItem value="5ft">5'0"</MenuItem>
                    <MenuItem value="5ft_1in">5'1"</MenuItem>
                    <MenuItem value="5ft_2in">5'2"</MenuItem>
                    <MenuItem value="5ft_3in">5'3"</MenuItem>
                    <MenuItem value="5ft_4in">5'4"</MenuItem>
                    <MenuItem value="5ft_5in">5'5"</MenuItem>
                    <MenuItem value="5ft_6in">5'6"</MenuItem>
                    <MenuItem value="5ft_7in">5'7"</MenuItem>
                    <MenuItem value="5ft_8in">5'8"</MenuItem>
                    <MenuItem value="5ft_9in">5'9"</MenuItem>
                    <MenuItem value="5ft_10in">5'10"</MenuItem>
                    <MenuItem value="5ft_11in">5'11"</MenuItem>
                    <MenuItem value="6ft">6'0"</MenuItem>
                    <MenuItem value="6ft_1in">6'1"</MenuItem>
                    <MenuItem value="6ft_2in">6'2"</MenuItem>
                    <MenuItem value="6ft_3in">6'3"</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {(localFilters.heightRange[0] || localFilters.heightRange[1]) && (
              <Button
                size="small"
                onClick={() => handleClear("heightRange")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "education":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select
                value={localFilters.education}
                onChange={(e) => handleChange("education", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Any</MenuItem>
                {EDUCATION_OPTIONS.map((edu) => (
                  <MenuItem key={edu} value={edu.toLowerCase().replace(" ", "_")}>
                    {edu}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {localFilters.education && (
              <Button
                size="small"
                onClick={() => handleClear("education")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "occupation":
        return (
          <Box>
            <FormControl fullWidth size="small">
              <Select
                value={localFilters.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Any</MenuItem>
                {OCCUPATION_OPTIONS.map((occ) => (
                  <MenuItem key={occ} value={occ.toLowerCase().replace(" ", "_")}>
                    {occ}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {localFilters.occupation && (
              <Button
                size="small"
                onClick={() => handleClear("occupation")}
                sx={{ mt: 1, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      case "maritalStatus":
        return (
          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {MARITAL_STATUS_OPTIONS.map((status) => (
                <Chip
                  key={status}
                  label={status}
                  onClick={() => handleMultiSelectChange("maritalStatus", status)}
                  color={localFilters.maritalStatus.includes(status) ? "error" : "default"}
                  variant={localFilters.maritalStatus.includes(status) ? "filled" : "outlined"}
                />
              ))}
            </Box>
            {localFilters.maritalStatus.length > 0 && (
              <Button
                size="small"
                onClick={() => handleClear("maritalStatus")}
                sx={{ mt: 2, textTransform: "none", color: "#666" }}
              >
                Clear
              </Button>
            )}
          </Box>
        );

      default:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Filter options coming soon
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          minHeight: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
          Refine Matches
        </Typography>
        <Link
          component="button"
          onClick={handleReset}
          sx={{
            color: "#dc2626",
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Reset
        </Link>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", minHeight: "500px" }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: "280px",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "#fafafa",
          }}
        >
          <List sx={{ p: 0 }}>
            {filterCategories.map((category) => (
              <ListItem key={category.id} disablePadding>
                <ListItemButton
                  onClick={() => !category.locked && setActiveCategory(category.id)}
                  selected={activeCategory === category.id}
                  disabled={category.locked}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&.Mui-selected": {
                      bgcolor: "#f0f0f0",
                      borderLeft: "3px solid #dc2626",
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                      },
                    },
                    "&:hover": {
                      bgcolor: category.locked ? "transparent" : "#f5f5f5",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  <ListItemText
                    primary={category.label}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: activeCategory === category.id ? 600 : 400,
                      color: activeCategory === category.id ? "#1a1a1a" : "#666",
                    }}
                  />
                  {category.locked && (
                    <LockIcon sx={{ fontSize: 16, color: "#999", ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Content Area */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}>
            {filterCategories.find((c) => c.id === activeCategory)?.label}
          </Typography>
          {renderFilterContent()}
        </Box>
      </DialogContent>

      {/* Bottom Action Button */}
      <Box
        sx={{
          p: 3,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "#fafafa",
        }}
      >
        <Button
          onClick={handleApply}
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#dc2626",
            color: "white",
            py: 1.5,
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          Show Matches
        </Button>
      </Box>
    </Dialog>
  );
};

export default FilterDialog;
