import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Favorite as FavoriteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';

const BlogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for a Successful First Date',
      excerpt: 'First dates can be nerve-wracking. Here are our top tips to make your first date successful and enjoyable.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'March 15, 2023',
      author: 'Priya Sharma',
      category: 'Dating Advice',
      readTime: '5 min read',
      likes: 42
    },
    {
      id: 2,
      title: 'Understanding Modern Matchmaking',
      excerpt: 'How has matchmaking evolved in the digital age? We explore the blend of tradition and technology in finding your perfect match.',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'February 28, 2023',
      author: 'Rahul Kapoor',
      category: 'Matchmaking',
      readTime: '8 min read',
      likes: 67
    },
    {
      id: 3,
      title: 'Cultural Compatibility in Relationships',
      excerpt: 'Why cultural understanding matters in relationships and how to navigate differences successfully.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'February 15, 2023',
      author: 'Meera Patel',
      category: 'Relationship Advice',
      readTime: '7 min read',
      likes: 89
    },
    {
      id: 4,
      title: 'The Science Behind Attraction',
      excerpt: 'Explore the psychological and biological factors that influence who we\'re attracted to and why.',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'January 30, 2023',
      author: 'Dr. Anika Singh',
      category: 'Science of Love',
      readTime: '10 min read',
      likes: 124
    },
    {
      id: 5,
      title: 'Building Trust in a New Relationship',
      excerpt: 'Trust is the foundation of any strong relationship. Learn how to build and maintain it from the start.',
      image: 'https://images.unsplash.com/photo-1529255484355-cb73c33c04bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'January 18, 2023',
      author: 'Vikram Mehta',
      category: 'Relationship Advice',
      readTime: '6 min read',
      likes: 76
    },
    {
      id: 6,
      title: 'Traditional vs. Modern Marriage Approaches',
      excerpt: 'Comparing traditional arranged marriages and modern love marriages in today\'s context.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'January 5, 2023',
      author: 'Sanjay Joshi',
      category: 'Marriage',
      readTime: '9 min read',
      likes: 98
    }
  ];

  const categories = [
    'Dating Advice',
    'Relationship Advice',
    'Matchmaking',
    'Success Stories',
    'Marriage',
    'Science of Love'
  ];

  const popularPosts = [
    {
      title: 'How to Know if You\'re Ready for Marriage',
      date: 'Dec 20, 2022',
      reads: '1.2K',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'The Dos and Don\'ts of Online Dating',
      date: 'Nov 15, 2022',
      reads: '2.4K',
      image: 'https://images.unsplash.com/photo-1529255484355-cb73c33c04bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'Cultural Wedding Traditions Across India',
      date: 'Oct 8, 2022',
      reads: '3.1K',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#faf7f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          // background: ` url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1960&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 15,
          textAlign: 'center',
          mb: 8
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 3, color: '#51365F', fontStyle: 'italic', }}>
            Bandhan Match Blog
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: '700px', margin: '0 auto' }}>
            Expert advice, success stories, and insights into the world of matchmaking and relationships
          </Typography>
          <TextField
            placeholder="Search articles..."
            variant="outlined"
            size="medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              background: 'white',
              borderRadius: 2,
              width: isMobile ? '90%' : '60%',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      {/* Blog Content */}
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#51365F', fontWeight: 700, mb: 4 }}>
              Latest Articles
            </Typography>

            <Grid container spacing={4}>
              {blogPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card sx={{
                    display: 'flex',
                    width: '330px',
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(216, 27, 96, 0.15)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                      image={post.image}
                      alt={post.title}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2.5 }}>
                      <Chip
                        label={post.category}
                        size="small"
                        sx={{
                          background: '#51365F',
                          color: 'white',
                          mb: 2,
                          fontWeight: 600,
                          alignSelf: 'flex-start'
                        }}
                      />
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#37474f' }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                        {post.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ fontSize: 18, mr: 0.5, color: '#51365F' }} />
                          <Typography variant="caption" sx={{ color: '#5d4037' }}>{post.author}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ fontSize: 18, mr: 0.5, color: '#51365F' }} />
                          <Typography variant="caption" sx={{ color: '#5d4037' }}>{post.date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FavoriteIcon sx={{ fontSize: 18, mr: 0.5, color: '#51365F' }} />
                          <Typography variant="caption" sx={{ color: '#5d4037' }}>{post.likes}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                        pt: 1.5,
                        borderTop: '1px solid #f0f0f0'
                      }}>
                        <Typography variant="caption" sx={{ color: '#5d4037' }}>{post.readTime}</Typography>
                        <Button
                          endIcon={<ArrowForwardIcon />}
                          size="small"
                          sx={{
                            color: '#51365F',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'rgba(216, 27, 96, 0.1)'
                            }
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button variant="contained" sx={{ mx: 1, background: '#51365F', minWidth: '40px', borderRadius: 2 }}>
                1
              </Button>
              <Button variant="outlined" sx={{ mx: 1, borderColor: '#51365F', color: '#51365F', minWidth: '40px', borderRadius: 2 }}>
                2
              </Button>
              <Button variant="outlined" sx={{ mx: 1, borderColor: '#51365F', color: '#51365F', minWidth: '40px', borderRadius: 2 }}>
                3
              </Button>
              <Button variant="outlined" sx={{ mx: 1, borderColor: '#51365F', color: '#51365F', borderRadius: 2 }}>
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ py: 4 }}>
          <Paper elevation={0} sx={{
            background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.03) 100%)',
            p: 3,
            borderRadius: 3,
            mb: 4,
            border: '1px solid rgba(216, 27, 96, 0.1)'
          }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#51365F', fontWeight: 600 }}>
              About Our Blog
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#5d4037' }}>
              Welcome to the Bandhan Match blog, where we share expert advice, success stories, and insights into the world of matchmaking and relationships.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: '#51365F',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                }
              }}
            >
              Subscribe
            </Button>
          </Paper>

          {/* Categories */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 4, border: '1px solid rgba(216, 27, 96, 0.1)' }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant="outlined"
                  sx={{
                    borderColor: '#51365F',
                    color: '#51365F',
                    mb: 1,
                    '&:hover': {
                      background: '#51365F',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Popular Posts */}
          <Paper elevation={0} sx={{
            p: 3,
            borderRadius: 3,
            mb: 4,
            border: '1px solid rgba(216, 27, 96, 0.1)'
          }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 3 }}>
              Popular Posts
            </Typography>
            {popularPosts.map((post, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <Box
                  component="img"
                  src={post.image}
                  alt={post.title}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    objectFit: 'cover',
                    mr: 2
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#37474f' }}>{post.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="body2" color="#8d6e63">{post.date}</Typography>
                    <Typography variant="body2" color="#8d6e63">{post.reads} reads</Typography>
                  </Box>
                </Box>
                {index < popularPosts.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>

          {/* Social Media */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(216, 27, 96, 0.1)' }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#51365F', fontWeight: 600, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#3b5998', background: 'rgba(59, 89, 152, 0.1)', '&:hover': { background: '#3b5998', color: 'white' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: '#E1306C', background: 'rgba(225, 48, 108, 0.1)', '&:hover': { background: '#E1306C', color: 'white' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: '#1DA1F2', background: 'rgba(29, 161, 242, 0.1)', '&:hover': { background: '#1DA1F2', color: 'white' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{
                color: '#0077B5',
                background: 'rgba(0, 119, 181, 0.1)',
                '&:hover': {
                  background: '#0077B5',
                  color: 'white'
                }
              }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPage;