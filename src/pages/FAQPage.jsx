import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TextField,
  Button,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const FAQPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqCategories = [
    {
      title: "Account & Registration",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button at the top right corner of our homepage. Fill in your basic information, verify your email address, and you'll be ready to start your matchmaking journey!"
        },
        {
          question: "Is there a fee to register?",
          answer: "Basic registration is completely free. This allows you to create a profile, browse potential matches, and receive limited match suggestions. Our premium plans offer additional features for those seeking more personalized matchmaking."
        },
        {
          question: "How do I delete my account?",
          answer: "You can delete your account by going to 'Account Settings' and selecting 'Delete Account'. Please note that this action is permanent and all your data will be removed from our system."
        }
      ]
    },
    {
      title: "Matching Process",
      questions: [
        {
          question: "How does your matching algorithm work?",
          answer: "Our algorithm uses a combination of personality traits, interests, values, and preferences that you provide in your profile. We use advanced machine learning to identify compatibility patterns and suggest matches that have the highest potential for meaningful connections."
        },
        {
          question: "Can I change my matching preferences?",
          answer: "Yes, you can update your preferences at any time through your profile settings. Adjusting your preferences will immediately update the match suggestions you receive."
        },
        {
          question: "How many matches will I receive daily?",
          answer: "Free members typically receive 3-5 matches per day, while premium members receive 7-10 curated matches daily based on their compatibility score and preferences."
        }
      ]
    },
    {
      title: "Privacy & Safety",
      questions: [
        {
          question: "Is my personal information secure?",
          answer: "We take privacy and security very seriously. All personal information is encrypted, and we never share your data with third parties without your explicit consent. You can control what information is visible on your profile."
        },
        {
          question: "How do I report suspicious activity?",
          answer: "If you encounter any suspicious profiles or behavior, please use the 'Report' button on the user's profile or contact our safety team immediately at safety@matchmaker.com. We investigate all reports promptly."
        },
        {
          question: "Can I hide my profile from certain users?",
          answer: "Yes, our premium members have access to features like 'Incognito Mode' which allows you to browse profiles without being seen, and you can block specific users from viewing your profile."
        }
      ]
    },
    {
      title: "Subscription & Payments",
      questions: [
        {
          question: "What subscription plans do you offer?",
          answer: "We offer three tiers: Basic (free), Premium (monthly or yearly billing), and VIP (premium features plus personalized matchmaking services). You can compare plans and upgrade at any time from your account page."
        },
        {
          question: "How do I cancel my subscription?",
          answer: "You can cancel your subscription at any time from the 'Billing' section of your account settings. After cancellation, you'll continue to have access to premium features until the end of your billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied with our service within the first two weeks, contact our support team for a full refund."
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#d81b60', 
            fontWeight: 700, 
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ color: '#555', maxWidth: '700px', mx: 'auto' }}>
          Find answers to common questions about our matchmaking services, account management, and more.
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 6, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SearchIcon sx={{ mr: 1, color: '#d81b60' }} />
          <Typography variant="h6" sx={{ color: '#37474f', fontWeight: 600 }}>
            Search Questions
          </Typography>
        </Box>
        <TextField
          fullWidth
          placeholder="Type your question here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#d81b60',
              },
            },
          }}
        />
      </Paper>

      {/* FAQ Categories */}
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category, index) => (
          <Box key={index} sx={{ mb: 5 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#d81b60', 
                fontWeight: 600, 
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}
            >
              {category.title}
            </Typography>
            
            {category.questions.map((item, qIndex) => (
              <Accordion 
                key={qIndex} 
                expanded={expanded === `panel${index}-${qIndex}`} 
                onChange={handleChange(`panel${index}-${qIndex}`)}
                sx={{ 
                  mb: 2, 
                  borderRadius: '12px !important',
                  '&:before': {
                    display: 'none',
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#d81b60' }} />}
                  sx={{
                    backgroundColor: expanded === `panel${index}-${qIndex}` ? 'rgba(216, 27, 96, 0.08)' : 'transparent',
                    borderRadius: '12px',
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(216, 27, 96, 0.04)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#37474f' }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))
      ) : (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h5" sx={{ color: '#78909c', mb: 3 }}>
            No results found for "{searchQuery}"
          </Typography>
          <Typography variant="body1" sx={{ color: '#78909c' }}>
            Try different keywords or browse the categories above
          </Typography>
        </Box>
      )}

      {/* Contact Support Section */}
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, mt: 8, background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.05) 100%)' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ color: '#d81b60', fontWeight: 700, mb: 2 }}>
              Still have questions?
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mb: 3, fontSize: '1.1rem' }}>
              Can't find the answer you're looking for? Our support team is here to help you with any questions about our matchmaking services.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)',
                }
              }}
            >
              Contact Support
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                width: '100%',
                height: '200px',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23d81b60\' fill-opacity=\'0.2\' d=\'M0,128L48,117.3C96,107,192,85,288,112C384,139,480,213,576,218.7C672,224,768,160,864,138.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default FAQPage;