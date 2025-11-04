import React, { useState } from "react";
import {
  Box,
  Typography,
  CardMedia,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  LinearProgress,
  Container,
} from "@mui/material";
import {
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Message as MessageIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Height as HeightIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Cake as CakeIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Restaurant as RestaurantIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  Monitor as MonitorIcon,
} from "@mui/icons-material";

// --- Theme Colors ---
const PRIMARY_COLOR = "#51365F"; // Purple
const ACCENT_COLOR = "#ff9800"; // Orange/Gold
const LIGHT_BACKGROUND = "rgba(81, 54, 95, 0.05)";

const ProfileDetails = ({
  selectedMatch,
  onBackToMatches,
  onShowInterest,
  onShowSuperInterest,
  getAge,
  onToggleShortlist,
  actionButtonOption = 1,
}) => {
  const [activeTab, setActiveTab] = useState("about");

  if (!selectedMatch) return null;
  console.log(selectedMatch);

  // Helper function to calculate age
  const getAgeValue =
    getAge ||
    ((dob) => {
      if (!dob) return "N/A";
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    });

  // Helper function to format text (convert snake_case to Title Case)
  const formatText = (text) => {
    if (!text) return "Not specified";
    return text
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to format height
  const formatHeight = (height) => {
    if (!height) return "Not specified";
    // If height is in format like "5ft_4in", convert to "5'4""
    if (height.includes("ft")) {
      return height.replace("ft_", "'").replace("in", '"').replace("_", "");
    }
    return height;
  };

  // Get icon for each preference type
  const getPreferenceIcon = (label) => {
    const iconMap = {
      Height: <HeightIcon />,
      Age: <CakeIcon />,
      "Marital Status": <FavoriteBorderIcon />,
      Religion: <VerifiedIcon />,
      "Mother Tongue": <LanguageIcon />,
      Caste: <VerifiedIcon />,
      Occupation: <WorkIcon />,
      "Annual Income": <WorkIcon />,
      Diet: <RestaurantIcon />,
      Drinking: <MonitorIcon />,
      Smoking: <MonitorIcon />,
      Education: <SchoolIcon />,
      Location: <LocationOnIcon />,
      "Family Background": <FamilyRestroomIcon />,
    };
    return iconMap[label] || <VerifiedIcon />;
  };

  // Build matching criteria from API response
  const buildMatchingCriteria = (match) => {
    if (!match.preferenceMatching || match.preferenceMatching.length === 0) {
      return [];
    }

    return match.preferenceMatching.map((pref) => ({
      label: pref.label,
      userValue: pref.userValue,
      matchValue: pref.matchValue,
      match: pref.match,
      userPreference: pref.userPreference || "Any",
      icon: getPreferenceIcon(pref.label),
      // You can categorize based on importance if needed
      category: ["Age", "Marital Status", "Religion", "Caste", "Diet"].includes(
        pref.label
      )
        ? "MustHaves"
        : "GoodToHaves",
    }));
  };

  // Get matching criteria from API response
  const matchingCriteria = buildMatchingCriteria(selectedMatch);
  const matchedCriteriaList = matchingCriteria.filter((c) => c.match === true);
  const allCriteriaList = matchingCriteria;

  const matchCount =
    selectedMatch.matchedPreferencesCount || matchedCriteriaList.length;
  const totalCriteria =
    selectedMatch.totalPreferencesCount || allCriteriaList.length;
  const matchPercentage =
    totalCriteria > 0
      ? Math.round((matchCount / totalCriteria) * 100)
      : selectedMatch.matchScore || 0;

  // Filter criteria by category - FIXED: Use preferenceMatching for mustHaves
  const mustHaves = allCriteriaList;
  console.log("MustHaves:", mustHaves, allCriteriaList);

  // FIXED: Convert goodToHaves object to array for mapping
  const goodToHaves = selectedMatch?.preferences
    ? Object.entries(selectedMatch.preferences).map(([key, value]) => {
        // Convert the object key to a readable label
        const labelMap = {
          ageRange: "Age Range",
          heightRange: "Height Range",
          maritalStatus: "Marital Status",
          religion: "Religion",
          education: "Education",
          annualIncomePref: "Annual Income",
          diet: "Diet",
          educationPref: "Education Preference",
          familyOrientation: "Family Orientation",
          location: "Location",
          locationPref: "Location Preference",
          maritalStatusPref: "Marital Status Preference",
          occupationPref: "Occupation Preference",
          profession: "Profession",
          qualities: "Qualities",
          religionCastePref: "Religion & Caste",
          relocation: "Relocation",
        };

        return {
          label: labelMap[key] || formatText(key),
          value: value,
          icon: getPreferenceIcon(labelMap[key] || key),
        };
      })
    : [];

  console.log("goodToHaves", goodToHaves);

  // Component to render the action buttons based on the selected option
  const ActionButtons = ({ option }) => {
    const isInterestSent = selectedMatch.hasShownInterest;
    const isSuperInterestSent = selectedMatch.hasShownSuperInterest;

    const interestButton = (
      <Button
        variant={option === 2 || option === 4 ? "outlined" : "contained"}
        size="small"
        startIcon={<FavoriteBorderIcon />}
        onClick={() => onShowInterest(selectedMatch?._id)}
        disabled={isInterestSent}
        sx={{
          backgroundColor:
            option === 2 || option === 4 ? "transparent" : PRIMARY_COLOR,
          color: option === 2 || option === 4 ? PRIMARY_COLOR : "white",
          borderColor: PRIMARY_COLOR,
          "&:hover": {
            backgroundColor:
              option === 2 || option === 4 ? LIGHT_BACKGROUND : "#3d2847",
            borderColor: PRIMARY_COLOR,
          },
          textTransform: "none",
          fontWeight: 600,
          flexGrow: 1,
          py: 1.5,
          borderRadius: 2,
        }}
      >
        {isInterestSent ? "Interest Sent" : "Interest"}
      </Button>
    );

    const superInterestButton = (
      <Button
        variant="contained"
        size="small"
        startIcon={<StarIcon />}
        onClick={() => onShowSuperInterest(selectedMatch?._id)}
        disabled={isSuperInterestSent}
        sx={{
          backgroundColor: ACCENT_COLOR,
          color: "white",
          "&:hover": { backgroundColor: "#f57c00" },
          textTransform: "none",
          fontWeight: 600,
          flexGrow: option === 3 ? 0 : 1,
          minWidth: option === 3 ? "auto" : "none",
          py: 1.5,
          borderRadius: 2,
        }}
      >
        {option === 3 ? (
          <StarIcon />
        ) : isSuperInterestSent ? (
          "Super Interest Sent"
        ) : (
          "Super Interest"
        )}
      </Button>
    );

    const shortlistButton = (
      <Button
        variant="contained"
        size="small"
        startIcon={<StarIcon />}
        onClick={() => onToggleShortlist(selectedMatch?._id)}
        sx={{
          backgroundColor: "#9300f5d3",
          color: "white",
          "&:hover": { backgroundColor: "#9300f5ff" },
          textTransform: "none",
          fontWeight: 600,
          flexGrow: option === 3 ? 0 : 1,
          minWidth: option === 3 ? "auto" : "none",
          py: 1.5,
          borderRadius: 2,
        }}
      >
        Shortlist
      </Button>
    );

    const chatButton = (
      <Button
        variant={option === 2 || option === 4 ? "contained" : "outlined"}
        size="small"
        startIcon={<MessageIcon />}
        sx={{
          backgroundColor:
            option === 2 || option === 4 ? PRIMARY_COLOR : "transparent",
          color: option === 2 || option === 4 ? "white" : PRIMARY_COLOR,
          borderColor: PRIMARY_COLOR,
          "&:hover": {
            backgroundColor:
              option === 2 || option === 4 ? "#3d2847" : LIGHT_BACKGROUND,
            borderColor: PRIMARY_COLOR,
          },
          textTransform: "none",
          fontWeight: 600,
          flexGrow: 1,
          py: 1.5,
          borderRadius: 2,
        }}
      >
        Chat
      </Button>
    );

    switch (option) {
      case 1:
        return (
          <Box display="flex" gap={2}>
            {interestButton}
            {superInterestButton}
            {shortlistButton}
            {chatButton}
          </Box>
        );
      case 2:
        return (
          <Box display="flex" gap={2}>
            {superInterestButton}
            {chatButton}
            {shortlistButton}
            {interestButton}
          </Box>
        );
      case 3:
        return (
          <Box display="flex" gap={1} alignItems="stretch" height="56px">
            {interestButton}
            {chatButton}
            <IconButton
              aria-label="Super Interest"
              size="large"
              onClick={() => onShowSuperInterest(selectedMatch._id)}
              disabled={isSuperInterestSent}
              sx={{
                backgroundColor: isSuperInterestSent
                  ? ACCENT_COLOR
                  : LIGHT_BACKGROUND,
                color: isSuperInterestSent ? "white" : ACCENT_COLOR,
                borderRadius: 2,
                p: 1.5,
                "&:hover": {
                  backgroundColor: isSuperInterestSent
                    ? "#f57c00"
                    : "rgba(255, 152, 0, 0.2)",
                },
              }}
            >
              <StarIcon />
            </IconButton>
          </Box>
        );
      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {interestButton}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<StarIcon />}
                  onClick={() => onShowSuperInterest(selectedMatch._id)}
                  disabled={isSuperInterestSent}
                  sx={{
                    color: ACCENT_COLOR,
                    borderColor: ACCENT_COLOR,
                    "&:hover": { backgroundColor: "rgba(255, 152, 0, 0.08)" },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Super Interest
                </Button>
                {chatButton}
              </Box>
            </Grid>
          </Grid>
        );
      default:
        return ActionButtons({ option: 1 });
    }
  };

  const DetailItem = ({ icon, label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            backgroundColor: LIGHT_BACKGROUND,
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 50,
            minHeight: 50,
          }}
        >
          {React.cloneElement(icon, {
            sx: { color: PRIMARY_COLOR, fontSize: 24 },
          })}
        </Box>
        <Stack>
          <Typography variant="caption" sx={{ color: "#888", fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
            {value || "Not specified"}
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );

  const PreferenceItem = ({ icon, label, preference, actual, match }) => (
    <Grid item xs={12} sm={6}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: match
            ? "rgba(76, 175, 80, 0.08)"
            : match === false
            ? "rgba(244, 67, 54, 0.08)"
            : "rgba(158, 158, 158, 0.08)",
          borderColor: match
            ? "#4caf50"
            : match === false
            ? "#f44336"
            : "#9e9e9e",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {match === true ? (
              <CheckCircleIcon
                sx={{ color: "#4caf50", fontSize: 22, mt: 0.5 }}
              />
            ) : match === false ? (
              <CloseIcon sx={{ color: "#f44336", fontSize: 22, mt: 0.5 }} />
            ) : (
              <CloseIcon sx={{ color: "#9e9e9e", fontSize: 22, mt: 0.5 }} />
            )}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: PRIMARY_COLOR, mb: 0.2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>{label}</span>
                </Stack>
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block" }}
              >
                <strong>Pref:</strong> {preference} | <strong>Match:</strong>{" "}
                {actual}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

  const GoodToHaveItem = ({ icon, label, value }) => {
    // Filter function to remove _id fields from objects and arrays
    const filterIdFields = (data) => {
      if (Array.isArray(data)) {
        return data.map((item) => {
          if (typeof item === "object" && item !== null) {
            const { _id, ...filteredItem } = item;
            return filteredItem;
          }
          return item;
        });
      } else if (typeof data === "object" && data !== null) {
        const { _id, ...filteredData } = data;
        return filteredData;
      }
      return data;
    };

    const filteredValue = filterIdFields(value);

    // Helper function to render different value types
    const renderValue = (val) => {
      // Handle null/undefined
      if (val === null || val === undefined) {
        return <Typography variant="caption">Not specified</Typography>;
      }

      // Handle arrays
      if (Array.isArray(val)) {
        if (val.length === 0) {
          return <Typography variant="caption">No preferences set</Typography>;
        }

        return (
          <Box sx={{ mt: 1 }}>
            {val.map((item, index) => (
              <Chip
                key={index}
                label={
                  typeof item === "object" ? JSON.stringify(item) : String(item)
                }
                size="small"
                variant="outlined"
                sx={{
                  m: 0.5,
                  borderColor: "#9e9e9e",
                  color: "#666",
                  backgroundColor: "rgba(158, 158, 158, 0.05)",
                  fontSize: "0.7rem",
                  height: "24px",
                }}
              />
            ))}
          </Box>
        );
      }

      // Handle objects
      if (typeof val === "object") {
        const entries = Object.entries(val);
        if (entries.length === 0) {
          return (
            <Typography variant="caption">No details specified</Typography>
          );
        }

        return (
          <Box sx={{ mt: 1 }}>
            {entries.map(([key, value], index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 0.5,
                  borderBottom:
                    index < entries.length - 1
                      ? "1px solid rgba(158, 158, 158, 0.2)"
                      : "none",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: PRIMARY_COLOR,
                    minWidth: "80px",
                  }}
                >
                  {formatText(key)}:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#666", textAlign: "right", flex: 1 }}
                >
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </Typography>
              </Box>
            ))}
          </Box>
        );
      }

      // Handle simple values
      return (
        <Typography
          variant="body2"
          sx={{
            color: "#333",
            fontWeight: 500,
            backgroundColor: "rgba(158, 158, 158, 0.1)",
            p: 1,
            borderRadius: 1,
            mt: 1,
          }}
        >
          {String(val)}
        </Typography>
      );
    };

    return (
      <Grid item xs={12}>
        <Card
          variant="outlined"
          sx={{
            backgroundColor: "rgba(158, 158, 158, 0.03)",
            borderColor: "#e0e0e0",
            borderRadius: 3,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(158, 158, 158, 0.06)",
              borderColor: "#9e9e9e",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  color: "#9e9e9e",
                  fontSize: 24,
                  mt: 0.5,
                  backgroundColor: "rgba(158, 158, 158, 0.1)",
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "50px",
                  minHeight: "50px",
                }}
              >
                {icon}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: PRIMARY_COLOR,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {label}
                  <Chip
                    label="Preference"
                    size="small"
                    variant="filled"
                    sx={{
                      backgroundColor: "#9e9e9e",
                      color: "white",
                      fontSize: "0.6rem",
                      height: "20px",
                    }}
                  />
                </Typography>

                {renderValue(filteredValue)}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container className="px-0" maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={onBackToMatches}
        sx={{
          color: PRIMARY_COLOR,
          textTransform: "none",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Back to Matches
      </Button>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(81, 54, 95, 0.15)",
          overflow: "hidden",
          position: "sticky",
          top: 20,
          mb: 4,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="500"
            image={
              selectedMatch.profileImage || "https://via.placeholder.com/500"
            }
            alt={selectedMatch.name}
            sx={{ objectFit: "cover", width: "100%", maxHeight: 500 }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              zIndex: 10,
            }}
          >
            <Chip
              icon={<VerifiedIcon />}
              label={`${matchPercentage}% Match`}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                py: 1.5,
                px: 1,
                borderRadius: 2,
                height: "auto",
              }}
            />
            <Stack direction="row" spacing={1}>
              <IconButton
                sx={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  "&:hover": { backgroundColor: "white" },
                }}
              >
                <ShareIcon sx={{ color: PRIMARY_COLOR }} />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  "&:hover": { backgroundColor: "white" },
                }}
              >
                <MoreVertIcon sx={{ color: PRIMARY_COLOR }} />
              </IconButton>
            </Stack>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              p: 3,
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {selectedMatch.name},{" "}
              {selectedMatch.age || getAgeValue(selectedMatch.dob)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ opacity: 0.9 }}
            >
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {selectedMatch.city || "City"}, {selectedMatch.state || "State"}
              </Typography>
              {selectedMatch.customId && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: 1, bgcolor: "white" }}
                  />
                  <Typography variant="caption">
                    ID: {selectedMatch.customId}
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        </Box>

        <div
          className="position-fixed bottom-0"
          style={{ transform: "translate(28px, -17px)" }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 8px 30px rgba(81, 54, 95, 0.15)",
            }}
          >
            <ActionButtons option={actionButtonOption} />
          </Box>
        </div>
      </Card>

      <Box>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              p: 1,
              gap: 1,
            }}
          >
            {["about", "family", "looking"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                sx={{
                  flex: 1,
                  textTransform: "capitalize",
                  fontWeight: 700,
                  color: activeTab === tab ? "white" : PRIMARY_COLOR,
                  backgroundColor:
                    activeTab === tab ? PRIMARY_COLOR : "transparent",
                  border:
                    activeTab === tab
                      ? `1px solid ${PRIMARY_COLOR}`
                      : "1px solid transparent",
                  borderRadius: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor:
                      activeTab === tab ? "#3d2847" : LIGHT_BACKGROUND,
                    color: activeTab === tab ? "white" : PRIMARY_COLOR,
                  },
                }}
              >
                {tab === "about"
                  ? "About Me"
                  : tab === "family"
                  ? "Family"
                  : "Partner Pref."}
              </Button>
            ))}
          </Box>
        </Card>

        <Stack spacing={4}>
          {activeTab === "about" && (
            <>
              {selectedMatch.about && (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, color: PRIMARY_COLOR }}
                    >
                      Bio 📝
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ lineHeight: 1.7, color: "#444" }}
                    >
                      {selectedMatch.about}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 3, color: PRIMARY_COLOR }}
                  >
                    Personal Details 👤
                  </Typography>
                  <Grid container spacing={3}>
                    <DetailItem
                      icon={<HeightIcon />}
                      label="Height"
                      value={formatHeight(selectedMatch.height)}
                    />
                    <DetailItem
                      icon={<CakeIcon />}
                      label="Age"
                      value={`${
                        selectedMatch.age || getAgeValue(selectedMatch.dob)
                      } Years`}
                    />
                    <DetailItem
                      icon={<LanguageIcon />}
                      label="Mother Tongue"
                      value={
                        Array.isArray(selectedMatch.motherTongue)
                          ? selectedMatch.motherTongue
                              .map(formatText)
                              .join(", ")
                          : formatText(selectedMatch.motherTongue)
                      }
                    />
                    <DetailItem
                      icon={<WorkIcon />}
                      label="Occupation"
                      value={formatText(selectedMatch.occupation)}
                    />
                    <DetailItem
                      icon={<SchoolIcon />}
                      label="Education"
                      value={formatText(selectedMatch.education)}
                    />
                    <DetailItem
                      icon={<RestaurantIcon />}
                      label="Diet"
                      value={formatText(selectedMatch.diet)}
                    />
                  </Grid>
                  <Divider sx={{ my: 3 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 3, color: PRIMARY_COLOR }}
                  >
                    Background 🕌
                  </Typography>
                  <Grid container spacing={3}>
                    <DetailItem
                      icon={<FavoriteBorderIcon />}
                      label="Marital Status"
                      value={formatText(selectedMatch.maritalStatus)}
                    />
                    <DetailItem
                      icon={<LocationOnIcon />}
                      label="Location"
                      value={`${selectedMatch.city || "N/A"}, ${
                        selectedMatch.state || "N/A"
                      }`}
                    />
                    <DetailItem
                      icon={<VerifiedIcon />}
                      label="Religion"
                      value={formatText(selectedMatch.religion)}
                    />
                    <DetailItem
                      icon={<VerifiedIcon />}
                      label="Caste"
                      value={formatText(selectedMatch.caste)}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "family" && (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <FamilyRestroomIcon
                  sx={{ fontSize: 60, color: PRIMARY_COLOR, mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, color: PRIMARY_COLOR }}
                >
                  Family Information is Private
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                  To respect the member's privacy, family details are only
                  unlocked after an <strong>Interest</strong> or{" "}
                  <strong>Super Interest</strong> is accepted.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => onShowInterest(selectedMatch._id)}
                  disabled={selectedMatch.hasShownInterest}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    "&:hover": { backgroundColor: "#3d2847" },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {selectedMatch.hasShownInterest
                    ? "Interest Sent"
                    : "Send Interest to Connect"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "looking" && (
            <>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: PRIMARY_COLOR }}
                  >
                    Compatibility Score 🎉
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    You meet{" "}
                    <strong>
                      {matchCount} out of {totalCriteria}
                    </strong>{" "}
                    of {selectedMatch.name}'s desired criteria.
                  </Typography>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                      >
                        Match Progress
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                      >
                        {matchPercentage}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={matchPercentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: LIGHT_BACKGROUND,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: PRIMARY_COLOR,
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {allCriteriaList.length > 0 ? (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {mustHaves.length > 0 && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: PRIMARY_COLOR,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <StarIcon sx={{ color: ACCENT_COLOR }} /> Must-Have
                          Preferences
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 3 }}
                        >
                          These criteria are considered{" "}
                          <strong>critical</strong> for a potential match.
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                          {mustHaves.map((criterion, index) => (
                            <PreferenceItem
                              key={index}
                              icon={criterion.icon}
                              label={criterion.label}
                              preference={criterion.userPreference}
                              actual={criterion.matchValue}
                              match={criterion.match}
                            />
                          ))}
                        </Grid>
                      </>
                    )}

                    {goodToHaves.length > 0 && (
                      <>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: PRIMARY_COLOR,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FavoriteBorderIcon sx={{ color: PRIMARY_COLOR }} />
                          Good-to-Have Preferences
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666", mb: 3 }}
                        >
                          These preferences are desirable but flexible for
                          compatibility.
                        </Typography>

                        <Grid container spacing={2}>
                          {goodToHaves.map((pref, index) => (
                            <GoodToHaveItem
                              key={index}
                              icon={pref.icon}
                              label={pref.label}
                              value={pref.value}
                            />
                          ))}
                        </Grid>
                      </>
                    )}

                    {allCriteriaList.length === 0 &&
                      goodToHaves.length === 0 && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#999", textAlign: "center" }}
                        >
                          No preference matching data available.
                        </Typography>
                      )}
                  </CardContent>
                </Card>
              ) : (
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      No preference matching information available for this
                      profile.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default ProfileDetails;
