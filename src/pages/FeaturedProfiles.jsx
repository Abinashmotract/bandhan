import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import { useEffect as useEffectReact } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchMatches, showSuperInterest, addToShortlist, removeFromShortlist, updateShortlistStatus } from "../store/slices/matchesSlice";
import { showSuccess, showError } from "../utils/toast";
import MatchCard from "../components/MatchCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
        fetchMatches({ page: 1, limit: 6, sortBy: "matchScore" })
      );

      if (fetchMatches.fulfilled.match(result)) {
        const matches = result.payload?.data || result.payload || [];
        // Only show 6 profiles in the carousel
        setFeaturedMatches(Array.isArray(matches) ? matches.slice(0, 6) : []);
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
        <Box sx={{ px: { xs: 2, md: 0 } }}>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            style={{ padding: "20px 0" }}
          >
            {[...Array(4)].map((_, index) => (
              <SwiperSlide key={index}>
                <Skeleton
                  variant="rectangular"
                  height={450}
                  sx={{ borderRadius: 2, maxWidth: "320px", mx: "auto" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
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
        <Box
          sx={{
            position: "relative",
            px: { xs: 2, md: 0 },
            "& .swiper-button-next, & .swiper-button-prev": {
              color: "#51365F",
              backgroundColor: "white",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              "&:after": {
                fontSize: "18px",
                fontWeight: "bold",
              },
              "&:hover": {
                backgroundColor: "#51365F",
                color: "white",
              },
            },
            "& .swiper-button-next": {
              right: "10px",
            },
            "& .swiper-button-prev": {
              left: "10px",
            },
            "& .swiper-pagination-bullet": {
              backgroundColor: "#51365F",
              opacity: 0.5,
              "&.swiper-pagination-bullet-active": {
                opacity: 1,
              },
            },
          }}
        >
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            style={{ padding: "20px 0 50px" }}
          >
            {featuredMatches.map((match) => (
              <SwiperSlide key={match._id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Box sx={{ maxWidth: "320px", width: "100%" }}>
                    <MatchCard
                      match={match}
                      onShowInterest={handleShowInterest}
                      onShowSuperInterest={handleShowSuperInterest}
                      onViewProfile={handleViewProfile}
                      onToggleShortlist={handleToggleShortlist}
                      onChatClick={handleChatClick}
                      getAge={getAge}
                      getHeight={getHeight}
                      variant="vertical"
                      compact={true}
                    />
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      <AnimatedSection>
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/matches")}
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
        </Box>
      </AnimatedSection>
    </Box>
  );
};

export default FeaturedProfiles;
