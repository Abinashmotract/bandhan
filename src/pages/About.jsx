import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  alpha
} from '@mui/material';
import {
  Favorite,
  Groups,
  EmojiPeople,
  Security,
  Diversity3,
  Celebration,
  ArrowForward,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Psychology,
  ConnectWithoutContact,
  Handshake
} from '@mui/icons-material';
import "../styles/About.css";
import { Link } from 'react-router-dom';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      description: "With over 15 years of experience in matchmaking, Rajesh has helped thousands find their perfect partners."
    },
    {
      name: "Priya Sharma",
      role: "Head of Matchmaking",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      description: "Priya brings a psychological approach to matchmaking, ensuring deep compatibility between partners."
    },
    {
      name: "Amit Patel",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      description: "Amit ensures our platform remains cutting-edge with the latest technology and security features."
    },
    {
      name: "Sunita Devi",
      role: "Customer Success",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      description: "Sunita and her team provide exceptional support to our members throughout their journey."
    }
  ];

  // Stats data
  const stats = [
    { icon: <Favorite sx={{ fontSize: 40 }} />, value: '500K+', label: 'Successful Matches' },
    { icon: <Groups sx={{ fontSize: 40 }} />, value: '10M+', label: 'Profiles Created' },
    { icon: <EmojiPeople sx={{ fontSize: 40 }} />, value: '95%', label: 'Satisfaction Rate' },
    { icon: <Diversity3 sx={{ fontSize: 40 }} />, value: '28', label: 'Countries Served' }
  ];

  // Values data
  const values = [
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Trust & Safety",
      description: "We prioritize the safety and privacy of our members with verified profiles and advanced security measures."
    },
    {
      icon: <Celebration sx={{ fontSize: 40 }} />,
      title: "Success Stories",
      description: "Our greatest satisfaction comes from the thousands of successful marriages that began on our platform."
    },
    {
      icon: <Diversity3 sx={{ fontSize: 40 }} />,
      title: "Inclusivity",
      description: "We welcome people from all communities, cultures, and backgrounds to find their perfect match."
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: "Smart Matching",
      description: "Our advanced algorithm considers hundreds of factors to find your most compatible matches."
    },
    {
      icon: <Handshake sx={{ fontSize: 40 }} />,
      title: "Lifetime Support",
      description: "Our relationship experts provide guidance even after you've found your match."
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      // background: 'linear-gradient(135deg, rgba(255,249,251,0.95) 0%, rgba(248,187,208,0.8) 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        // background: `
        //   radial-gradient(circle at 10% 20%, rgba(255, 200, 220, 0.3) 0%, transparent 20%),
        //   radial-gradient(circle at 90% 70%, rgba(216, 27, 96, 0.2) 0%, transparent 20%)
        // `,
        zIndex: 0
      }
    }}>
      <Container maxWidth="false" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{
          textAlign: 'center',
          py: 8,
          opacity: 0,
          animation: 'fadeInUp 1s ease forwards',
          '@keyframes fadeInUp': {
            '0%': { opacity: 0, transform: 'translateY(40px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Typography variant="h2" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            About bandhnammatch
          </Typography>
          <Typography variant="h6" sx={{
            color: 'black',
            maxWidth: '700px',
            mx: 'auto',
            fontSize: '1.2rem',
            lineHeight: 1.6
          }}>
            Connecting hearts since 2010. Our mission is to help you find your perfect life partner through
            trusted matchmaking and advanced compatibility matching.
          </Typography>
        </Box>

        {/* Stats Section */}
        <Box>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #d81b60, #880e4f)',
                  padding: '2px',
                  animation: `pulseBorder 2s infinite, fadeInUp 0.8s ease forwards ${index * 0.2 + 0.3}s`,
                  opacity: 0,
                  '&:hover': {
                    '& .stats-card': {
                      transform: 'translateY(-10px)'
                    }
                  }
                }}>
                  <Card className="stats-card" sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }}>
                    <Box sx={{
                      color: '#d81b60',
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{
                      color: '#d81b60',
                      fontWeight: 700,
                      mb: 1,
                      background: 'linear-gradient(45deg, #d81b60, #880e4f)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: 'black',
                      fontWeight: 500
                    }}>
                      {stat.label}
                    </Typography>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Story Section - Now in two columns */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box >
                <Typography variant="h3" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 3 }}>
                  Our Story
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8, mb: 3, fontSize: '1.1rem' }}>
                  bandhnammatch was founded in 2010 with a simple vision: to create a platform where
                  people could find their life partners in a safe, trusted environment. What started as
                  a small initiative has now grown into one of the most respected matchmaking platforms,
                  with thousands of success stories.
                </Typography>
                <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
                  Our unique compatibility algorithm and personalized matchmaking approach have helped
                  us maintain a success rate that is unmatched in the industry.
                </Typography>
                <Button variant="contained" endIcon={<ArrowForward />} sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                  }
                }}>
                  Read Our Success Stories
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Mission & Values - Improved Design */}
        <Box sx={{ py: 6 }}>
          <Typography variant="h3" sx={{
            textAlign: 'center',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}>
            Our Mission & Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    width: 280,
                    height: "100%",
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.4s ease",
                    border: "1px solid rgba(216, 27, 96, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 32px rgba(216, 27, 96, 0.15)",
                      "& .moon-background": {
                        opacity: 1,
                        transform: "scale(1) translate(0, 0)",
                      },
                      "& .card-content": {
                        color: "#fff",
                        zIndex: 2,
                        position: "relative",
                      },
                      "& .icon-container": {
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                      },
                      "& .card-title": {
                        color: "#fff",
                      },
                      "& .card-desc": {
                        color: "#fff",
                      },
                    },
                  }}
                >
                  <Box
                    className="moon-background"
                    sx={{
                      position: "absolute",
                      top: "-30%",
                      right: "-30%",
                      width: "150%",
                      height: "150%",
                      background:
                        "radial-gradient(circle at top right, #d81b60, #880e4f)",
                      borderRadius: "50%",
                      opacity: 0,
                      transform: "scale(0.5) translate(20%, -20%)",
                      transition:
                        "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      zIndex: 1,
                    }}
                  />
                  <Box className="card-content" sx={{ transition: "all 0.4s ease", zIndex: 2, position: "relative", }}>
                    <Box className="icon-container" sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(216, 27, 96, 0.1) 0%, rgba(136, 14, 79, 0.05) 100%)", display: "flex", alignItems: "center", justifyContent: "center", mb: 3, color: "#d81b60", transition: "all 0.4s ease", }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" className="card-title" sx={{ color: "#d81b60", mb: 2, fontWeight: 600, fontSize: "1.3rem", transition: "all 0.4s ease", }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" className="card-desc" sx={{ color: "#37474f", lineHeight: 1.6, transition: "all 0.4s ease", }}>
                      {value.description}
                    </Typography>
                  </Box>
                </Card>

              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section - Improved Design */}
        <Box sx={{ py: 6 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'black', maxWidth: '600px', mx: 'auto', mb: 6, fontSize: '1.1rem' }}>
            Our dedicated team works tirelessly to help you find your perfect match
          </Typography>

          <Grid container justifyContent="center" spacing={4}>
            {teamMembers?.slice(0, 3).map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  p: 3,
                  width: 280,
                  borderRadius: '30px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  textAlign: 'center',
                  opacity: 0,
                  animation: `fadeInUp 0.8s ease forwards ${index * 0.2 + 0.3}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.03)',
                    boxShadow: '0 20px 40px rgba(216, 27, 96, 0.2)',
                    '& .team-image': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 15px 30px rgba(216, 27, 96, 0.3)'
                    }
                  }
                }}>
                  <Box sx={{ position: 'relative', width: 180, height: 180, mb: 3, mx: 'auto' }}>
                    <Box className="team-image" component="img" src={member.image} alt={member.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid #fce4ec', boxShadow: '0 8px 20px rgba(216, 27, 96, 0.2)', transition: 'all 0.5s ease' }} />

                    {/* Decorative Circles */}
                    <Box sx={{ position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, borderRadius: '50%', border: '2px solid rgba(216, 27, 96, 0.2)', animation: 'pulse 3s infinite ease-in-out', zIndex: -1 }} />

                    <Box sx={{ position: 'absolute', top: -15, left: -15, right: -15, bottom: -15, borderRadius: '50%', border: '1px solid rgba(216, 27, 96, 0.1)', animation: 'pulse 4s infinite ease-in-out', animationDelay: '1s', zIndex: -2 }} />
                  </Box>

                  {/* Name and Role */}
                  <Typography variant="h6" sx={{ color: '#d81b60', fontWeight: 700, mb: 0.5, fontSize: '1.3rem' }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#880e4f', mb: 2, fontWeight: 500, fontSize: '0.9rem' }}>
                    {member.role}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" sx={{ color: '#37474f', lineHeight: 1.6, mb: 3 }}>
                    {member.description}
                  </Typography>

                  {/* Social Icons - Always visible with rotation on hover */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <IconButton sx={{
                      color: '#d81b60',
                      background: 'rgba(216, 27, 96, 0.1)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        background: '#d81b60',
                        color: 'black',
                        transform: 'rotate(360deg)'
                      }
                    }}>
                      <Facebook sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton sx={{
                      color: '#d81b60',
                      background: 'rgba(216, 27, 96, 0.1)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        background: '#d81b60',
                        color: 'black',
                        transform: 'rotate(360deg)'
                      }
                    }}>
                      <Instagram sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton sx={{
                      color: '#d81b60',
                      background: 'rgba(216, 27, 96, 0.1)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        background: '#d81b60',
                        color: 'black',
                        transform: 'rotate(360deg)'
                      }
                    }}>
                      <LinkedIn sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* View All Team Button */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button variant="outlined" sx={{
              borderRadius: '50px',
              px: 4,
              py: 1.5,
              color: '#d81b60',
              borderColor: '#d81b60',
              fontWeight: 'bold',
              '&:hover': {
                background: 'rgba(216, 27, 96, 0.1)',
                borderColor: '#d81b60',
                transform: 'translateY(-3px)',
                boxShadow: '0 5px 15px rgba(216, 27, 96, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}>
              View Full Team
            </Button>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box sx={{
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.03) 100%)',
          borderRadius: '30px',
          mb: 4
        }}>
          <Typography variant="h3" sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Ready to Find Your Perfect Match?
          </Typography>
          <Typography variant="body1" sx={{
            color: 'black',
            maxWidth: '600px',
            mx: 'auto',
            mb: 4,
            fontSize: '1.1rem'
          }}>
            Join thousands of happy couples who found their life partners on bandhnammatch
          </Typography>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="contained" endIcon={<ArrowForward />} sx={{
              borderRadius: '50px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
              }
            }}>
              Create Your Profile
            </Button>
          </Link>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <IconButton sx={{ color: '#d81b60', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: '#d81b60', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: '#d81b60', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: '#d81b60', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <LinkedIn />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: 'black' }}>
            © 2023 bandhnammatch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;