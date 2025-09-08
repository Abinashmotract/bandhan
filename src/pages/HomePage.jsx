import React from "react";
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    InputAdornment,
} from "@mui/material";
import {
    Search as SearchIcon,
    Favorite as FavoriteIcon,
    People as PeopleIcon,
    Chat as ChatIcon,
    Security as SecurityIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowForward,
} from "@mui/icons-material";
import "../styles/HomePage.css";
import {Link} from "react-router-dom";
import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";
import {useEffect} from "react";
import FeaturedProfiles from './FeaturedProfiles';

// Animation variants
const fadeInUp = {
    hidden: {opacity: 0, y: 60},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
};

const fadeInRight = {
    hidden: {opacity: 0, x: 60},
    visible: {opacity: 1, x: 0, transition: {duration: 0.6}},
};

const fadeInLeft = {
    hidden: {opacity: 0, x: -60},
    visible: {opacity: 1, x: 0, transition: {duration: 0.6}},
};

const scaleIn = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.5}},
};

// Custom hook to detect when element is in viewport
const useInViewport = (threshold = 0.1) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({triggerOnce: true, threshold});

    useEffect(() => {
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

const HomePage = () => {
    const successStories = [
        {
            name: "Amit & Priya",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "Met through bandhnammatch in 2021 and married in 2022",
        },
        {
            name: "Rahul & Sneha",
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "Found their perfect match within 3 months of joining",
        },
        {
            name: "Vikram & Anjali",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
            story: "Connected through our advanced matching system",
        },
    ];

    const features = [
        {
            icon: <PeopleIcon sx={{fontSize: 40}} />,
            title: "Smart Matching",
            description: "Advanced algorithm to find your perfect partner based on preferences",
        },
        {
            icon: <SecurityIcon sx={{fontSize: 40}} />,
            title: "Privacy Protection",
            description: "Your data is secure with our advanced privacy controls",
        },
        {
            icon: <ChatIcon sx={{fontSize: 40}} />,
            title: "Secure Chat",
            description: "Get to know your matches with our safe messaging system",
        },
        {
            icon: <FavoriteIcon sx={{fontSize: 40}} />,
            title: "Verified Profiles",
            description: "All profiles are verified to ensure authenticity",
        },
    ];

    return (
        <Box sx={{padding: "0px"}}>
            {/* Hero Section */}
            <Box
                id="home"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        backgroundImage: `url('https://allpngfree.com/apf-prod-storage-api/storage/thumbnails/shaadi-card-png-images-download-thumbnail-1638812589.jpg')`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        opacity: 0.08,
                        pointerEvents: "none",
                    },
                }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            position: "absolute",
                            color: item % 2 === 0 ? "#ff9eb6" : "#d81b60",
                            fontSize: "24px",
                            opacity: 0.7,
                            animation: `floatHeart 15s infinite ease-in-out ${item * 1.5}s`,
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            zIndex: 1,
                        }}
                    >
                        ❤
                    </Box>
                ))}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            position: "absolute",
                            width: item % 2 === 0 ? 60 : 40,
                            height: item % 2 === 0 ? 60 : 40,
                            borderRadius: item % 3 === 0 ? "50%" : "10px",
                            background:
                                item % 2 === 0
                                    ? "linear-gradient(135deg, rgba(216, 27, 96, 0.2) 0%, rgba(136, 14, 79, 0.1) 100%)"
                                    : "linear-gradient(135deg, rgba(255, 200, 220, 0.3) 0%, rgba(248, 187, 208, 0.2) 100%)",
                            animation: `float 8s infinite ease-in-out ${item * 0.5}s`,
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            zIndex: 1,
                        }}
                    />
                ))}

                <Container maxWidth="xl" sx={{position: "relative", zIndex: 2}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <AnimatedSection>
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        color: "#C8A2C8",
                                        fontWeight: 800,
                                        fontSize: {xs: "2.5rem", md: "3.5rem"},
                                        fontStyle: "italic",
                                        // background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                                        // backgroundClip: 'text',
                                        // WebkitBackgroundClip: 'text',
                                        // WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                    }}
                                >
                                    Find Your Perfect Life Partner
                                </Typography>
                            </AnimatedSection>

                            <AnimatedSection>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#37474f",
                                        mb: 4,
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    Join thousands of couples who found their soulmates through our trusted matchmaking
                                    service
                                </Typography>
                            </AnimatedSection>

                            {/* Search Box */}
                            <AnimatedSection>
                                <Box
                                    sx={{
                                        backgroundColor: "white",
                                        borderRadius: "50px",
                                        p: 1,
                                        boxShadow: "0 10px 30px rgba(216, 27, 96, 0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        maxWidth: "500px",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 15px 35px rgba(216, 27, 96, 0.3)",
                                        },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        placeholder="Search by profession, interest, or community..."
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                borderRadius: "50px",
                                                border: "none",
                                                "&:focus": {
                                                    border: "none",
                                                    outline: "none",
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& fieldset": {border: "none"},
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: "50px",
                                            px: 3,
                                            py: 1,
                                            background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            boxShadow: "0 5px 15px rgba(136, 14, 79, 0.3)",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                                boxShadow: "0 8px 20px rgba(136, 14, 79, 0.4)",
                                                background: "linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)",
                                            },
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Box>
                            </AnimatedSection>

                            {/* Enhanced Stats Section */}
                            <AnimatedSection>
                                <Box sx={{mt: 4}}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#78909c",
                                            mb: 2,
                                            fontWeight: 500,
                                        }}
                                    >
                                        Trusted by over 500,000 members worldwide
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <AnimatedSection variant={fadeInUp} threshold={0.2}>
                                                <Box
                                                    sx={{
                                                        textAlign: "center",
                                                        p: 2,
                                                        background: "rgba(255, 255, 255, 0.7)",
                                                        borderRadius: "12px",
                                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-5px)",
                                                            background: "rgba(255, 255, 255, 0.9)",
                                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                        },
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: "#C8A2C8",
                                                            fontWeight: "bold",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        500K+
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#78909c",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Members
                                                    </Typography>
                                                </Box>
                                            </AnimatedSection>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <AnimatedSection variant={fadeInUp} threshold={0.2}>
                                                <Box
                                                    sx={{
                                                        textAlign: "center",
                                                        p: 2,
                                                        background: "rgza(255, 255, 255, 0.7)",
                                                        borderRadius: "12px",
                                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-5px)",
                                                            background: "rgba(255, 255, 255, 0.9)",
                                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                        },
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: "#C8A2C8",
                                                            fontWeight: "bold",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        10K+
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#78909c",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Success Stories
                                                    </Typography>
                                                </Box>
                                            </AnimatedSection>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <AnimatedSection variant={fadeInUp} threshold={0.2}>
                                                <Box
                                                    sx={{
                                                        textAlign: "center",
                                                        p: 2,
                                                        background: "rgba(255, 255, 255, 0.7)",
                                                        borderRadius: "12px",
                                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-5px)",
                                                            background: "rgba(255, 255, 255, 0.9)",
                                                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                                        },
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: "#C8A2C8",
                                                            fontWeight: "bold",
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        99%
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#78909c",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Satisfaction
                                                    </Typography>
                                                </Box>
                                            </AnimatedSection>
                                        </Grid>
                                    </Grid>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mt: 2,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box sx={{display: "flex", mr: 2}}>
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <Box
                                                    key={item}
                                                    sx={{
                                                        width: 35,
                                                        height: 35,
                                                        borderRadius: "50%",
                                                        border: "2px solid white",
                                                        ml: -1,
                                                        background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                                                        transition: "transform 0.3s ease",
                                                        "&:hover": {
                                                            transform: "translateY(-3px)",
                                                            zIndex: item,
                                                        },
                                                    }}
                                                >
                                                    {item === 5 ? "5K+" : "U"}
                                                </Box>
                                            ))}
                                        </Box>
                                        <Typography variant="body2" sx={{color: "#78909c"}}>
                                            Join our community
                                        </Typography>
                                    </Box>
                                </Box>
                            </AnimatedSection>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                display: {xs: "none", md: "block"},
                            }}
                        >
                            <AnimatedSection variant={fadeInRight}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                            borderRadius: "20px",
                                            transform: "rotate(5deg)",
                                            zIndex: 0,
                                            transition: "all 0.5s ease",
                                            opacity: 0.8,
                                        },
                                        "&:hover::before": {
                                            transform: "rotate(3deg) scale(1.02)",
                                            opacity: 0.9,
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                                        alt="Happy couple"
                                        sx={{
                                            width: "100%",
                                            borderRadius: "20px",
                                            position: "relative",
                                            zIndex: 1,
                                            transform: "rotate(-5deg)",
                                            transition: "transform 0.5s ease, box-shadow 0.5s ease",
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                                            "&:hover": {
                                                transform: "rotate(0deg) scale(1.02)",
                                                boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Floating stats around the image */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "10%",
                                        right: "-5%",
                                        background: "white",
                                        borderRadius: "15px",
                                        p: 2,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        animation: "floatStats 6s infinite ease-in-out",
                                        zIndex: 3,
                                    }}
                                >
                                    <Typography variant="h6" sx={{color: "#d81b60", fontWeight: "bold"}}>
                                        500K+
                                    </Typography>
                                    <Typography variant="caption" sx={{color: "#78909c"}}>
                                        Successful Matches
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "20%",
                                        left: "-5%",
                                        background: "white",
                                        borderRadius: "15px",
                                        p: 2,
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                        animation: "floatStats 7s infinite ease-in-out",
                                        animationDelay: "1s",
                                        zIndex: 3,
                                    }}
                                >
                                    <Typography variant="h6" sx={{color: "#C8A2C8", fontWeight: "bold"}}>
                                        99%
                                    </Typography>
                                    <Typography variant="caption" sx={{color: "#78909c"}}>
                                        Satisfaction Rate
                                    </Typography>
                                </Box>
                            </AnimatedSection>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box
                id="features"
                sx={{
                    py: 8,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background:
                            "radial-gradient(circle at 30% 70%, rgba(248, 187, 208, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(136, 14, 79, 0.1) 0%, transparent 50%)",
                        zIndex: 0,
                    },
                }}
            >
                <Container maxWidth="xl" sx={{position: "relative", zIndex: 1}}>
                        <Box sx={{ position: "relative", pb: 4 }}>
  <FeaturedProfiles />

  {/* 👇 Marriage style border line */}
  <Box
    sx={{
      mt: 6,
      height: "4px",
      width: "100%",
      background: "linear-gradient(90deg, #d81b60, #C8A2C8, #ffd700)",
      borderRadius: "50px",
    }}
  />
</Box>

                    <AnimatedSection>
                        <Box sx={{textAlign: "center", mb: 6}}>
                            <Typography
                                variant="h3"
                                component="h2"
                                sx={{
                                    color: "#C8A2C8",
                                    mb: 2,
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                }}
                            >
                                Why Choose bandhnammatch?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "black",
                                    maxWidth: "600px",
                                    margin: "0 auto",
                                    fontSize: "1.1rem",
                                    position: "relative",
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-15px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "60px",
                                        height: "3px",
                                        background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                        borderRadius: "2px",
                                    },
                                }}
                            >
                                We provide the best platform to find your perfect life partner with trust and safety
                            </Typography>
                        </Box>
                    </AnimatedSection>

                    <Grid container spacing={2}>
                        {features?.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <AnimatedSection variant={scaleIn} threshold={0.1}>
                                    <Card
                                        sx={{
                                            textAlign: "center",
                                            p: 3,
                                            width: 300,
                                            borderRadius: "20px",
                                            background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
                                            boxShadow: "0 10px 30px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
                                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                            border: "1px solid rgba(248, 187, 208, 0.3)",
                                            "&:hover": {
                                                transform: "translateY(-12px) scale(1.02)",
                                                boxShadow:
                                                    "0 20px 40px rgba(216, 27, 96, 0.15), 0 8px 20px rgba(136, 14, 79, 0.1)",
                                                "& .feature-icon": {
                                                    transform: "scale(1.1) rotate(5deg)",
                                                    background: "linear-gradient(135deg, #d81b60 0%, #880e4f 100%)",
                                                    color: "white",
                                                },
                                            },
                                        }}
                                    >
                                        <Box
                                            className="feature-icon"
                                            sx={{
                                                color: "#d81b60",
                                                mb: 2,
                                                display: "inline-flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50%",
                                                boxShadow: "0 4px 15px rgba(216, 27, 96, 0.2)",
                                                transition: "all 0.4s ease",
                                                position: "relative",
                                                "&::after": {
                                                    content: '""',
                                                    position: "absolute",
                                                    width: "100%",
                                                    height: "100%",
                                                    borderRadius: "50%",
                                                    background:
                                                        "linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)",
                                                    animation: "pulse 2s infinite",
                                                    "@keyframes pulse": {
                                                        "0%": {
                                                            transform: "scale(1)",
                                                            opacity: 0.7,
                                                        },
                                                        "50%": {
                                                            transform: "scale(1.5)",
                                                            opacity: 0,
                                                        },
                                                        "100%": {
                                                            transform: "scale(1)",
                                                            opacity: 0.7,
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            {React.cloneElement(feature.icon, {
                                                sx: {fontSize: 40, position: "relative", zIndex: 1},
                                            })}
                                        </Box>
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                color: "#37474f",
                                                fontWeight: 600,
                                                background: "linear-gradient(135deg, #37474f 0%, #d81b60 50%)",
                                                backgroundClip: "text",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "#78909c", lineHeight: 1.6}}>
                                            {feature.description}
                                        </Typography>
                                    </Card>
                                </AnimatedSection>
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "20%",
                            left: "5%",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)",
                            animation: "float 6s ease-in-out infinite",
                            "@keyframes float": {
                                "0%, 100%": {
                                    transform: "translateY(0px)",
                                },
                                "50%": {
                                    transform: "translateY(-20px)",
                                },
                            },
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "30%",
                            right: "10%",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, rgba(248, 187, 208, 0.2) 0%, rgba(216, 27, 96, 0.1) 100%)",
                            animation: "float 5s ease-in-out infinite 1s",
                            "@keyframes float": {
                                "0%, 100%": {
                                    transform: "translateY(0px)",
                                },
                                "50%": {
                                    transform: "translateY(-15px)",
                                },
                            },
                        }}
                    />
                </Container>
            </Box>

            {/* Success Stories */}
            <Box id="stories" sx={{py: 8}}>
                <Container maxWidth="xl">
                    <AnimatedSection>
                        <Typography
                            variant="h3"
                            component="h2"
                            align="center"
                            sx={{color: "#C8A2C8", mb: 2, fontWeight: "bold", fontStyle: "italic"}}
                        >
                            Success Stories
                        </Typography>
                    </AnimatedSection>

                    <AnimatedSection>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{color: "black", maxWidth: "600px", margin: "0 auto 50px", fontSize: "1.1rem"}}
                        >
                            Real couples who found their perfect match through our platform
                        </Typography>
                    </AnimatedSection>

                    <Grid container spacing={4}>
                        {successStories.map((story, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <AnimatedSection variant={fadeInUp} threshold={0.1}>
                                    <Card
                                        sx={{
                                            borderRadius: "15px",
                                            overflow: "hidden",
                                            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                                            transition: "transform 0.3s",
                                            "&:hover": {transform: "translateY(-5px)"},
                                        }}
                                    >
                                        <CardMedia component="img" height="250" image={story.image} alt={story.name} />
                                        <CardContent sx={{textAlign: "center"}}>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                {story.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "white"}}>
                                                {story.story}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimatedSection>
                            </Grid>
                        ))}
                    </Grid>

                    <AnimatedSection>
                        <Box sx={{textAlign: "center", mt: 5}}>
                            <Link to="/success-stories" style={{textDecoration: "none"}}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderRadius: "50px",
                                        px: 4,
                                        py: 1,
                                        color: "#d81b60",
                                        borderColor: "#d81b60",
                                        "&:hover": {
                                            borderColor: "#d81b60",
                                            backgroundColor: "rgba(216, 27, 96, 0.04)",
                                        },
                                    }}
                                >
                                    View More Stories
                                    <ArrowForwardIcon sx={{ml: 1}} />
                                </Button>
                            </Link>
                        </Box>
                    </AnimatedSection>

                    <Box
                        sx={{
                            textAlign: "center",
                            mt: 10,
                            background:
                                "linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.03) 100%)",
                            borderRadius: "30px",
                            p: 6,
                        }}
                    >
                        <AnimatedSection>
                            <Typography
                                variant="h3"
                                sx={{fontWeight: 700, color: "#C8A2C8", fontStyle: "italic", mb: 2}}
                            >
                                Ready to Write Your Success Story?
                            </Typography>
                        </AnimatedSection>
                        <AnimatedSection>
                            <Typography
                                variant="body1"
                                sx={{color: "#78909c", maxWidth: "600px", mx: "auto", mb: 4, fontSize: "1.1rem"}}
                            >
                                Join thousands of couples who found their life partners on bandhnammatch
                            </Typography>
                        </AnimatedSection>
                        <AnimatedSection variant={scaleIn}>
                            <Link to="/register" style={{textDecoration: "none"}}>
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        borderRadius: "50px",
                                        px: 5,
                                        py: 1.5,
                                        backgroundColor: "white",
                                        color: "#d81b60",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        "&:hover": {
                                            backgroundColor: "#f5f5f5",
                                        },
                                    }}
                                >
                                    Create Your Profile
                                </Button>
                            </Link>
                        </AnimatedSection>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
