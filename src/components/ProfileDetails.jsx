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
  getMatchingCriteria,
  actionButtonOption = 1,
}) => {
  const [activeTab, setActiveTab] = useState("about");

  if (!selectedMatch) return null;

  // Define getAgeValue FIRST
  const getAgeValue =
    getAge ||
    ((dob) => {
      if (!dob) return "N/A";
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    });

  // THEN define getMatchingCriteriaValue with PROPER DUMMY DATA
  const getMatchingCriteriaValue =
    getMatchingCriteria ||
    ((match) => {
      return {
        // Must-Haves - Critical criteria
        age: {
          label: "Age Range",
          userValue: "24-28 Years",
          matchValue: `${getAgeValue(match.dob)} Years`,
          match: getAgeValue(match.dob) >= 24 && getAgeValue(match.dob) <= 28,
          category: "MustHaves",
          icon: <CakeIcon />,
        },
        maritalStatus: {
          label: "Marital Status",
          userValue: "Never Married",
          matchValue: match.maritalStatus || "Never Married",
          match: (match.maritalStatus || "Never Married") === "Never Married",
          category: "MustHaves",
          icon: <FavoriteBorderIcon />,
        },
        religion: {
          label: "Religion",
          userValue: "Hindu",
          matchValue: match.religion || "Hindu",
          match: (match.religion || "Hindu") === "Hindu",
          category: "MustHaves",
          icon: <VerifiedIcon />,
        },
        caste: {
          label: "Caste",
          userValue: "Rajput/Kshatriya",
          matchValue: match.caste || "Rajput",
          match: ["Rajput", "Kshatriya"].includes(match.caste || "Rajput"),
          category: "MustHaves",
          icon: <VerifiedIcon />,
        },
        diet: {
          label: "Diet Type",
          userValue: "Vegetarian (Strict)",
          matchValue: match.diet || "Vegetarian",
          match: (match.diet || "Vegetarian") === "Vegetarian",
          category: "MustHaves",
          icon: <RestaurantIcon />,
        },

        // Good to Haves - Preferred but flexible criteria
        height: {
          label: "Height",
          userValue: "5'5'' - 5'9''",
          matchValue: match.height || "5'6''",
          match: true, // 5'6" is within range
          category: "GoodToHaves",
          icon: <HeightIcon />,
        },
        education: {
          label: "Education Level",
          userValue: "B.Tech/MBA or equivalent",
          matchValue: match.education || "B.Com.",
          match: false, // B.Com. doesn't match B.Tech/MBA
          category: "GoodToHaves",
          icon: <SchoolIcon />,
        },
        occupation: {
          label: "Occupation",
          userValue: "IT/Marketing/Finance",
          matchValue: match.occupation || "Accounting Professional",
          match: true, // Accounting is related to Finance
          category: "GoodToHaves",
          icon: <WorkIcon />,
        },
        location: {
          label: "Preferred City",
          userValue: "Delhi/NCR only",
          matchValue: `${match.city || "Greater Noida"}, ${
            match.state || "Uttar Pradesh"
          }`,
          match: true, // Greater Noida is in NCR
          category: "GoodToHaves",
          icon: <LocationOnIcon />,
        },
        drinking: {
          label: "Drinking Habits",
          userValue: "Non-drinker / Social",
          matchValue: match.drinking || "Non-drinker",
          match: (match.drinking || "Non-drinker") === "Non-drinker",
          category: "GoodToHaves",
          icon: <MonitorIcon />,
        },
        smoking: {
          label: "Smoking Habits",
          userValue: "Non-smoker (Mandatory)",
          matchValue: match.smoking || "Non-smoker",
          match: (match.smoking || "Non-smoker") === "Non-smoker",
          category: "GoodToHaves",
          icon: <MonitorIcon />,
        },
        income: {
          label: "Annual Income",
          userValue: "₹10-20 Lakhs",
          matchValue: "₹8 Lakhs",
          match: false, // Below preferred range
          category: "GoodToHaves",
          icon: <WorkIcon />,
        },
        familyStatus: {
          label: "Family Background",
          userValue: "Nuclear Family Preferred",
          matchValue: "Nuclear Family",
          match: true, // Matches preference
          category: "GoodToHaves",
          icon: <FamilyRestroomIcon />,
        },
      };
    });

  // Merge selectedMatch with mock data for fallback
  const selectedMatchData = {
    // Mock data as fallback
    name: "Nikita Roy",
    dob: "1997-01-01",
    customId: "DCYWTU108",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    height: "5'6''",
    occupation: "Accounting Professional",
    education: "B.Com. - Undergraduate Degree",
    motherTongue: "Hindi",
    maritalStatus: "Never Married",
    diet: "Vegetarian",
    drinking: "Non-drinker",
    smoking: "Non-smoker",
    religion: "Hindu",
    caste: "Rajput",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    about:
      "I'm a compassionate and optimistic individual who believes in living life with kindness and positivity. I enjoy exploring new ideas, learning continuously, and meeting people from different walks of life. I'm looking for a partner who is caring, mature, and shares similar core values.",
    familyDetails:
      "Nuclear Family from Greater Noida, Uttar Pradesh. Father is a Private Employee & Mother is a Homemaker.",
    hasShownInterest: false,
    hasShownSuperInterest: false,
    age: {
      label: "Age Range",
      userValue: "24-28 Years",
      matchValue: `${getAgeValue(match.dob)} Years`,
      match: getAgeValue(match.dob) >= 24 && getAgeValue(match.dob) <= 28,
      category: "MustHaves",
      icon: <CakeIcon />,
    },
    maritalStatus: {
      label: "Marital Status",
      userValue: "Never Married",
      matchValue: match.maritalStatus || "Never Married",
      match: (match.maritalStatus || "Never Married") === "Never Married",
      category: "MustHaves",
      icon: <FavoriteBorderIcon />,
    },
    religion: {
      label: "Religion",
      userValue: "Hindu",
      matchValue: match.religion || "Hindu",
      match: (match.religion || "Hindu") === "Hindu",
      category: "MustHaves",
      icon: <VerifiedIcon />,
    },
    caste: {
      label: "Caste",
      userValue: "Rajput/Kshatriya",
      matchValue: match.caste || "Rajput",
      match: ["Rajput", "Kshatriya"].includes(match.caste || "Rajput"),
      category: "MustHaves",
      icon: <VerifiedIcon />,
    },
    diet: {
      label: "Diet Type",
      userValue: "Vegetarian (Strict)",
      matchValue: match.diet || "Vegetarian",
      match: (match.diet || "Vegetarian") === "Vegetarian",
      category: "MustHaves",
      icon: <RestaurantIcon />,
    },

    // Good to Haves - Preferred but flexible criteria
    height: {
      label: "Height",
      userValue: "5'5'' - 5'9''",
      matchValue: match.height || "5'6''",
      match: true, // 5'6" is within range
      category: "GoodToHaves",
      icon: <HeightIcon />,
    },
    education: {
      label: "Education Level",
      userValue: "B.Tech/MBA or equivalent",
      matchValue: match.education || "B.Com.",
      match: false, // B.Com. doesn't match B.Tech/MBA
      category: "GoodToHaves",
      icon: <SchoolIcon />,
    },
    occupation: {
      label: "Occupation",
      userValue: "IT/Marketing/Finance",
      matchValue: match.occupation || "Accounting Professional",
      match: true, // Accounting is related to Finance
      category: "GoodToHaves",
      icon: <WorkIcon />,
    },
    location: {
      label: "Preferred City",
      userValue: "Delhi/NCR only",
      matchValue: `${match.city || "Greater Noida"}, ${
        match.state || "Uttar Pradesh"
      }`,
      match: true, // Greater Noida is in NCR
      category: "GoodToHaves",
      icon: <LocationOnIcon />,
    },
    drinking: {
      label: "Drinking Habits",
      userValue: "Non-drinker / Social",
      matchValue: match.drinking || "Non-drinker",
      match: (match.drinking || "Non-drinker") === "Non-drinker",
      category: "GoodToHaves",
      icon: <MonitorIcon />,
    },
    smoking: {
      label: "Smoking Habits",
      userValue: "Non-smoker (Mandatory)",
      matchValue: match.smoking || "Non-smoker",
      match: (match.smoking || "Non-smoker") === "Non-smoker",
      category: "GoodToHaves",
      icon: <MonitorIcon />,
    },
    income: {
      label: "Annual Income",
      userValue: "₹10-20 Lakhs",
      matchValue: "₹8 Lakhs",
      match: false, // Below preferred range
      category: "GoodToHaves",
      icon: <WorkIcon />,
    },
    familyStatus: {
      label: "Family Background",
      userValue: "Nuclear Family Preferred",
      matchValue: "Nuclear Family",
      match: true, // Matches preference
      category: "GoodToHaves",
      icon: <FamilyRestroomIcon />,
    },
    // Override with actual selectedMatch props
    ...selectedMatch,
  };

  // Calculate matching criteria
  const matchingCriteria = getMatchingCriteriaValue(selectedMatchData);
  const matchedCriteriaList = Object.values(matchingCriteria).filter(
    (c) => c.match
  );
  const allCriteriaList = Object.values(matchingCriteria);

  const matchCount = matchedCriteriaList.length;
  const totalCriteria = allCriteriaList.length;
  const matchPercentage = Math.round((matchCount / totalCriteria) * 100);

  // Filter criteria by category - FIXED: Proper filtering
  const mustHaves = allCriteriaList.filter((c) => c.category === "MustHaves");
  const goodToHaves = allCriteriaList.filter(
    (c) => c.category === "GoodToHaves"
  );

  console.log("Must Haves:", mustHaves); // Debug log
  console.log("Good To Haves:", goodToHaves); // Debug log

  // Rest of your component remains exactly the same...
  // [Keep all your existing ActionButtons, DetailItem, PreferenceItem, and JSX code]

  // Component to render the action buttons based on the selected option
  const ActionButtons = ({ option }) => {
    const isInterestSent = selectedMatchData.hasShownInterest;
    const isSuperInterestSent = selectedMatchData.hasShownSuperInterest;

    const interestButton = (
      <Button
        variant={option === 2 || option === 4 ? "outlined" : "contained"}
        size="medium"
        startIcon={<FavoriteBorderIcon />}
        onClick={() => onShowInterest(selectedMatchData.customId)}
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
        {isInterestSent ? "Interest Sent" : "Send Interest"}
      </Button>
    );

    const superInterestButton = (
      <Button
        variant="contained"
        size="large"
        startIcon={<StarIcon />}
        onClick={() => onShowSuperInterest(selectedMatchData.customId)}
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

    const chatButton = (
      <Button
        variant={option === 2 || option === 4 ? "contained" : "outlined"}
        size="large"
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
        Start Chat
      </Button>
    );

    switch (option) {
      case 1:
        return (
          <Box display="flex" gap={2}>
            {interestButton}
            {superInterestButton}
            {chatButton}
          </Box>
        );
      case 2:
        return (
          <Box display="flex" gap={2}>
            {superInterestButton}
            {chatButton}
            <Button
              variant="outlined"
              size="large"
              startIcon={<FavoriteBorderIcon />}
              onClick={() => onShowInterest(selectedMatchData.customId)}
              disabled={isInterestSent}
              sx={{
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                "&:hover": {
                  backgroundColor: LIGHT_BACKGROUND,
                  borderColor: PRIMARY_COLOR,
                },
                textTransform: "none",
                fontWeight: 600,
                flexGrow: 1,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {isInterestSent ? "Interest Sent" : "Send Interest"}
            </Button>
          </Box>
        );
      case 3:
        return (
          <Box display="flex" gap={1} alignItems="stretch" height="56px">
            <Button
              variant="contained"
              size="large"
              startIcon={<FavoriteBorderIcon />}
              onClick={() => onShowInterest(selectedMatchData.customId)}
              disabled={isInterestSent}
              sx={{
                backgroundColor: PRIMARY_COLOR,
                "&:hover": { backgroundColor: "#3d2847" },
                textTransform: "none",
                fontWeight: 600,
                flexGrow: 1,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {isInterestSent ? "Interest Sent" : "Send Interest"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<MessageIcon />}
              sx={{
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                "&:hover": {
                  backgroundColor: LIGHT_BACKGROUND,
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
            <IconButton
              aria-label="Super Interest"
              size="large"
              onClick={() => onShowSuperInterest(selectedMatchData.customId)}
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
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<FavoriteBorderIcon />}
                onClick={() => onShowInterest(selectedMatchData.customId)}
                disabled={isInterestSent}
                sx={{
                  backgroundColor: PRIMARY_COLOR,
                  "&:hover": { backgroundColor: "#3d2847" },
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {isInterestSent ? "Interest Sent" : "SEND INTEREST"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<StarIcon />}
                  onClick={() =>
                    onShowSuperInterest(selectedMatchData.customId)
                  }
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
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<MessageIcon />}
                  sx={{
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    "&:hover": { backgroundColor: LIGHT_BACKGROUND },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Chat
                </Button>
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
            : "rgba(244, 67, 54, 0.08)",
          borderColor: match ? "#4caf50" : "#f44336",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {match ? (
              <CheckCircleIcon
                sx={{ color: "#4caf50", fontSize: 22, mt: 0.5 }}
              />
            ) : (
              <CloseIcon sx={{ color: "#f44336", fontSize: 22, mt: 0.5 }} />
            )}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: PRIMARY_COLOR, mb: 0.2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {React.cloneElement(icon, { sx: { fontSize: 18 } })}
                  <span>{label}</span>
                </Stack>
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block" }}
              >
                **Pref:** {preference} | **Match:** {actual}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );

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
            image={selectedMatchData.profileImage}
            alt={selectedMatchData.name}
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
              {selectedMatchData.name}, {getAgeValue(selectedMatchData.dob)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ opacity: 0.9 }}
            >
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {selectedMatchData.city}, {selectedMatchData.state}
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, bgcolor: "white" }}
              />
              <Typography variant="caption">
                ID: {selectedMatchData.customId}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <CardContent>
          <ActionButtons option={actionButtonOption} />
        </CardContent>
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
                    {selectedMatchData.about}
                  </Typography>
                </CardContent>
              </Card>

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
                      value={selectedMatchData.height}
                    />
                    <DetailItem
                      icon={<CakeIcon />}
                      label="Age"
                      value={`${getAgeValue(selectedMatchData.dob)} Years`}
                    />
                    <DetailItem
                      icon={<LanguageIcon />}
                      label="Mother Tongue"
                      value={
                        Array.isArray(selectedMatchData.motherTongue)
                          ? selectedMatchData.motherTongue.join(", ")
                          : selectedMatchData.motherTongue
                      }
                    />
                    <DetailItem
                      icon={<WorkIcon />}
                      label="Occupation"
                      value={selectedMatchData.occupation}
                    />
                    <DetailItem
                      icon={<SchoolIcon />}
                      label="Education"
                      value={selectedMatchData.education}
                    />
                    <DetailItem
                      icon={<RestaurantIcon />}
                      label="Diet"
                      value={selectedMatchData.diet}
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
                      value={selectedMatchData.maritalStatus}
                    />
                    <DetailItem
                      icon={<LocationOnIcon />}
                      label="Location"
                      value={`${selectedMatchData.city}, ${selectedMatchData.state}`}
                    />
                    <DetailItem
                      icon={<VerifiedIcon />}
                      label="Religion"
                      value={selectedMatchData.religion}
                    />
                    <DetailItem
                      icon={<VerifiedIcon />}
                      label="Caste"
                      value={selectedMatchData.caste}
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
                  unlocked after an **Interest** or **Super Interest** is
                  accepted.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<LockIcon />}
                  onClick={() => onShowInterest(selectedMatchData.customId)}
                  disabled={selectedMatchData.hasShownInterest}
                  sx={{
                    backgroundColor: PRIMARY_COLOR,
                    "&:hover": { backgroundColor: "#3d2847" },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {selectedMatchData.hasShownInterest
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
                    You meet **{matchCount} out of {totalCriteria}** of{" "}
                    {selectedMatchData.name}'s desired criteria.
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

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(81, 54, 95, 0.12)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Must-Haves Section - NOW WITH DATA */}
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
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    These criteria are considered **critical** for a potential
                    match.
                  </Typography>

                  {mustHaves.length > 0 ? (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      {mustHaves.map((criterion, index) => (
                        <PreferenceItem
                          key={`must-${index}`}
                          label={criterion.label}
                          preference={criterion.userValue}
                          actual={criterion.matchValue}
                          match={criterion.match}
                          icon={criterion.icon}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", mb: 4, fontStyle: "italic" }}
                    >
                      No must-have preferences specified.
                    </Typography>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Good-to-Haves Section - NOW WITH DATA */}
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
                    <MonitorIcon sx={{ color: PRIMARY_COLOR }} /> Good-to-Have
                    Preferences
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                    These preferences are important but may be negotiable.
                  </Typography>

                  {goodToHaves.length > 0 ? (
                    <Grid container spacing={2}>
                      {goodToHaves.map((criterion, index) => (
                        <PreferenceItem
                          key={`good-${index}`}
                          label={criterion.label}
                          preference={criterion.userValue}
                          actual={criterion.matchValue}
                          match={criterion.match}
                          icon={criterion.icon}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontStyle: "italic" }}
                    >
                      No good-to-have preferences specified.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default ProfileDetails;
