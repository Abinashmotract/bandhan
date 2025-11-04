import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import { useEffect as useEffectReact } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMatches, showSuperInterest, addToShortlist, removeFromShortlist, updateShortlistStatus } from "../store/slices/matchesSlice";
import { showSuccess, showError } from "../utils/toast";
import MatchCard from "../components/MatchCard";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Custom hook to detect when element is in viewport
const useInViewport = (threshold = 0.1) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold });

  useEffectReact(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return { ref, controls };
};

// Animated component wrapper
const AnimatedSection = ({ children, variant = fadeInUp, threshold = 0.1 }) => {
  const { ref, controls } = useInViewport(threshold);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variant}
    >
      {children}
    </motion.div>
  );
};

// Utility functions
const getAge = (dob) => {
  if (!dob) return null;
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
  return height;
};

const FeaturedProfiles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedMatches();
  }, [dispatch]);

  const loadFeaturedMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dispatch(
        fetchMatches({ page: 1, limit: 4, sortBy: "matchScore" })
      );

      if (fetchMatches.fulfilled.match(result)) {
        const matches = result.payload?.data || result.payload || [];
        setFeaturedMatches(Array.isArray(matches) ? matches.slice(0, 4) : []);
      } else {
        setError(result.payload || "Failed to fetch featured profiles");
      }
    } catch (err) {
      setError("Failed to load featured profiles");
      console.error("Error loading featured matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowInterest = (profileId) => {
    // Interest is handled within MatchCard component
    console.log("Interest shown for:", profileId);
  };

  const handleShowSuperInterest = async (profileId) => {
    try {
      const result = await dispatch(showSuperInterest(profileId));
      if (showSuperInterest.fulfilled.match(result)) {
        showSuccess("Super interest sent successfully!");
      } else {
        showError(result.payload || "Failed to send super interest");
      }
    } catch (error) {
      showError("Failed to send super interest");
    }
  };

  const handleToggleShortlist = async (profileId, isShortlisted = null) => {
    // If isShortlisted is provided, just update the local state
    if (isShortlisted !== null) {
      setFeaturedMatches(prevMatches =>
        prevMatches.map(m =>
          m._id === profileId ? { ...m, isShortlisted } : m
        )
      );
      dispatch(updateShortlistStatus({ profileId, isShortlisted }));
      return;
    }

    // Otherwise, make the API call
    const matchToUpdate = featuredMatches.find(m => m._id === profileId);
    if (matchToUpdate) {
      try {
        if (matchToUpdate.isShortlisted) {
          const result = await dispatch(removeFromShortlist(profileId));
          if (removeFromShortlist.fulfilled.match(result)) {
            setFeaturedMatches(prevMatches =>
              prevMatches.map(m =>
                m._id === profileId ? { ...m, isShortlisted: false } : m
              )
            );
            showSuccess("Profile removed from shortlist");
          } else {
            showError(result.payload || "Failed to remove from shortlist");
          }
        } else {
          const result = await dispatch(addToShortlist(profileId));
          if (addToShortlist.fulfilled.match(result)) {
            setFeaturedMatches(prevMatches =>
              prevMatches.map(m =>
                m._id === profileId ? { ...m, isShortlisted: true } : m
              )
            );
            showSuccess("Profile added to shortlist");
          } else {
            // Handle "already shortlisted" error gracefully
            if (result.payload && result.payload.includes("already")) {
              setFeaturedMatches(prevMatches =>
                prevMatches.map(m =>
                  m._id === profileId ? { ...m, isShortlisted: true } : m
                )
              );
              showSuccess("Profile is already in your shortlist");
            } else {
              showError(result.payload || "Failed to add to shortlist");
            }
          }
        }
      } catch (error) {
        showError("Failed to update shortlist");
      }
    }
  };

  const handleViewProfile = (match) => {
    navigate(`/profile/${match._id}`);
  };

  const handleChatClick = (match) => {
    navigate(`/chat/${match._id}`);
  };

  return (
    <Box mb={4}>
      <AnimatedSection>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{
            color: "#51365F",
            mb: 2,
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
          Featured Profiles
        </Typography>
      </AnimatedSection>

      <AnimatedSection>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "black",
            maxWidth: "600px",
            margin: "0 auto 30px",
            fontSize: "1.1rem",
          }}
        >
          Discover genuine profiles from our verified community members
        </Typography>

      </AnimatedSection>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="error">{error}</Typography>
          <Button
            onClick={loadFeaturedMatches}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      ) : featuredMatches.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            No featured profiles available at the moment
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {featuredMatches.map((match) => (
            <Grid item xs={12} sm={6} md={3} key={match._id}>
              <MatchCard
                match={match}
                onShowInterest={handleShowInterest}
                onShowSuperInterest={handleShowSuperInterest}
                onViewProfile={handleViewProfile}
                onToggleShortlist={handleToggleShortlist}
                onChatClick={handleChatClick}
                getAge={getAge}
                getHeight={getHeight}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AnimatedSection>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Link to="/matches" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: "50px",
                px: 5,
                py: 1.5,
                background: "#51365F",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 8px 25px rgba(136, 14, 79, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 12px 30px rgba(136, 14, 79, 0.4)",
                  background:
                    "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                },
              }}
            >
              View More Profiles
            </Button>
          </Link>
        </Box>
      </AnimatedSection>
    </Box>
  );
};

export default FeaturedProfiles;
