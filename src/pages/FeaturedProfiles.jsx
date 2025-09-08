import React, {useState, useEffect} from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Chip,
    Skeleton,
    Avatar,
    Rating,
    CardActions,
} from "@mui/material";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Visibility as VisibilityIcon,
    Chat as ChatIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    School as SchoolIcon,
    ArrowForward as ArrowForwardIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import {motion} from "framer-motion";
import {useInView} from "react-intersection-observer";
import {useAnimation} from "framer-motion";
import {useEffect as useEffectReact} from "react";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../utils/api";
import defaultImg from "../assets/default.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchedProfiles } from "../store/slices/profileSlice";

// Animation variants
const fadeInUp = {
    hidden: {opacity: 0, y: 60},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
};

const scaleIn = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.5}},
};

// Custom hook to detect when element is in viewport
const useInViewport = (threshold = 0.1) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({triggerOnce: true, threshold});

    useEffectReact(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    return {ref, controls};
};

// Animated component wrapper
const AnimatedSection = ({children, variant = fadeInUp, threshold = 0.1}) => {
    const {ref, controls} = useInViewport(threshold);

    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variant}>
            {children}
        </motion.div>
    );
};

// Calculate age from date of birth
const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// Fallback avatar component
const ProfileAvatar = ({name, image, sx = {}}) => {
    if (image) {
        return <Avatar src={image} sx={{width: 60, height: 60, ...sx}} />;
    }

    return (
        <Avatar
            sx={{
                width: 60,
                height: 60,
                bgcolor: "#C8A2C8",
                ...sx,
            }}
        >
            {name ? name.charAt(0).toUpperCase() : <PersonIcon />}
        </Avatar>
    );
};

const FeaturedProfiles = () => {
    // const [error, setError] = useState(null);
    const [likedProfiles, setLikedProfiles] = useState(new Set());

    const dispatch = useDispatch();
    const { profiles, loading, error } = useSelector((state) => state.profiles);

    useEffect(() => {
        dispatch(fetchMatchedProfiles());
    }, [dispatch]);

    const accessToken = Cookies.get("accessToken");

    const handleLike = (profileId) => {
        const newLikedProfiles = new Set(likedProfiles);
        if (newLikedProfiles.has(profileId)) {
            newLikedProfiles.delete(profileId);
        } else {
            newLikedProfiles.add(profileId);
        }
        setLikedProfiles(newLikedProfiles);
    };

    // Sample interests for profiles
    const sampleInterests = [
        ["Travel", "Music", "Photography"],
        ["Reading", "Cooking", "Dancing"],
        ["Sports", "Movies", "Technology"],
        ["Art", "Design", "Fashion"],
        ["Business", "Finance", "Travel"],
    ];

    if (error) {
        console.log("Error fetching profiles:", error);
    }

    return (
        <Box mb={4}>
            <AnimatedSection>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    sx={{
                        color: "#C8A2C8",
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
                        margin: "0 auto 50px",
                        fontSize: "1.1rem",
                    }}
                >
                    Discover genuine profiles from our verified community members
                </Typography>
            </AnimatedSection>

            {loading ? (
                <Grid container spacing={2}>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow:
                                        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)", // 👈 Paper-shadow
                                    width: "100%",
                                    mx: "auto",
                                    background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
                                    border: "1px solid rgba(200, 162, 200, 0.2)",
                                    "&:hover": {
                                        transform: "translateY(-10px) scale(1.02)",
                                        boxShadow: "0 25px 50px rgba(216, 27, 96, 0.15)",
                                    },
                                }}
                            >
                                <Skeleton variant="rectangular" height={250} />
                                <CardContent sx={{p: 3}}>
                                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                        <Skeleton variant="circular" width={60} height={60} />
                                        <Box sx={{ml: 2}}>
                                            <Skeleton variant="text" width={120} height={25} />
                                            <Skeleton variant="text" width={80} height={20} />
                                        </Box>
                                    </Box>
                                    <Skeleton variant="text" height={20} width="100%" />
                                    <Skeleton variant="text" height={20} width="80%" />
                                    <Box sx={{display: "flex", gap: 0.5, mt: 2}}>
                                        <Skeleton variant="rounded" height={24} width={60} />
                                        <Skeleton variant="rounded" height={24} width={70} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {profiles?.slice(0, 4).map((profile, index) => {
                        const age = calculateAge(profile.dob);
                        const profileImage = profile.profileImage || defaultImg;
                        const profileInterests = sampleInterests[index % sampleInterests.length];
                        const isLiked = likedProfiles.has(profile._id);

                        return (
                            <Grid item xs={12} sm={6} md={3} key={profile._id}>
                                <AnimatedSection variant={scaleIn} threshold={0.1}>
                                    <Card
                                        sx={{
                                            borderRadius: "20px",
                                            overflow: "hidden",
                                            boxShadow:
                                                "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)", // 👈 Paper-shadow
                                            width: "350px", // 👈 fixed width
                                            mx: "auto",
                                            background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
                                            border: "1px solid rgba(200, 162, 200, 0.2)",
                                            "&:hover": {
                                                transform: "translateY(-10px) scale(1.02)",
                                                boxShadow: "0 25px 50px rgba(216, 27, 96, 0.15)",
                                            },
                                        }}
                                    >
                                        <Box sx={{position: "relative"}}>
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={profileImage}
                                                alt={profile.name}
                                                sx={{
                                                    objectFit: "cover",
                                                    filter: "brightness(0.9)",
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 15,
                                                    right: 15,
                                                    background: "rgba(255, 255, 255, 0.9)",
                                                    borderRadius: "50%",
                                                    width: 40,
                                                    height: 40,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backdropFilter: "blur(5px)",
                                                }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleLike(profile._id)}
                                                    sx={{
                                                        color: isLiked ? "#d81b60" : "#ccc",
                                                        transition: "color 0.3s",
                                                        "&:hover": {
                                                            color: "#d81b60",
                                                        },
                                                    }}
                                                >
                                                    {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <CardContent sx={{p: 3, position: "relative"}}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: -25,
                                                    left: 20,
                                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                                    borderRadius: "50%",
                                                    width: 60,
                                                    height: 60,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "4px solid white",
                                                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                <ProfileAvatar
                                                    name={profile.name}
                                                    image={profileImage}
                                                    sx={{width: 52, height: 52}}
                                                />
                                            </Box>

                                            <Box sx={{mt: 3}}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "flex-start",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            component="h3"
                                                            gutterBottom
                                                            sx={{
                                                                mb: 0.5,
                                                                fontWeight: 600,
                                                                background:
                                                                    "linear-gradient(135deg, #37474f 0%, #d81b60 50%)",
                                                                backgroundClip: "text",
                                                                WebkitBackgroundClip: "text",
                                                                WebkitTextFillColor: "transparent",
                                                            }}
                                                        >
                                                            {profile.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "#78909c",
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {age ? `${age} years` : "Age not specified"}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{display: "flex", alignItems: "center", mb: 1.5, mt: 2}}>
                                                    <WorkIcon sx={{fontSize: 18, mr: 1.5, color: "#C8A2C8"}} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{color: "text.secondary", fontSize: "0.9rem"}}
                                                    >
                                                        {profile.occupation || "Profession not specified"}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                                    <LocationIcon sx={{fontSize: 18, mr: 1.5, color: "#C8A2C8"}} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{color: "text.secondary", fontSize: "0.9rem"}}
                                                    >
                                                        {profile.location || "Location not specified"}
                                                    </Typography>
                                                </Box>

                                                {profileInterests && (
                                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2}}>
                                                        {profileInterests.slice(0, 3).map((interest, i) => (
                                                            <Chip
                                                                key={i}
                                                                label={interest}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderColor: "#C8A2C8",
                                                                    color: "#C8A2C8",
                                                                    fontSize: "0.7rem",
                                                                    height: 24,
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                )}

                                                <Rating
                                                    value={4.5}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                    sx={{mt: 2, color: "#C8A2C8"}}
                                                />
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{p: 3, pt: 0}}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<ChatIcon />}
                                                sx={{
                                                    borderRadius: "15px",
                                                    py: 1.2,
                                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                                    fontWeight: "600",
                                                    fontSize: "0.9rem",
                                                    textTransform: "none",
                                                    boxShadow: "0 5px 15px rgba(136, 14, 79, 0.3)",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        transform: "translateY(-2px)",
                                                        boxShadow: "0 8px 20px rgba(136, 14, 79, 0.4)",
                                                        background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                                    },
                                                }}
                                            >
                                                Connect Now
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </AnimatedSection>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            <AnimatedSection>
                <Box sx={{textAlign: "center", mt: 6}}>
                    <Link to="/matches" style={{textDecoration: "none"}}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                borderRadius: "50px",
                                px: 5,
                                py: 1.5,
                                background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                fontWeight: "bold",
                                fontSize: "1.1rem",
                                boxShadow: "0 8px 25px rgba(136, 14, 79, 0.3)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 12px 30px rgba(136, 14, 79, 0.4)",
                                    background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
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
