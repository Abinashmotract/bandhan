import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import {
  ExpandMore,
  Security,
  Cookie,
  DataUsage,
  Delete,
  Share,
  Policy,
  ContactSupport,
  Warning,
  CheckCircle,
  PrivacyTip
} from '@mui/icons-material';

const PrivacyPolicy = () => {
  const lastUpdated = "September 20, 2025";

  const quickLinks = [
    "Data Collection",
    "Cookies Usage",
    "Data Sharing",
    "Your Rights",
    "Contact Info"
  ];

  const dataTypes = [
    { type: "Personal Data", examples: "Email, Name, Phone, Address" },
    { type: "Usage Data", examples: "IP Address, Browser Info, Pages Visited" },
    { type: "Social Media Data", examples: "From Google, Facebook, etc." },
    { type: "Device Information", examples: "Location, Camera, Photos" }
  ];

  const cookieTypes = [
    { name: "Necessary Cookies", purpose: "Enable Service functionality and security" },
    { name: "Acceptance Cookies", purpose: "Track cookie policy acceptance" },
    { name: "Functionality Cookies", purpose: "Store user preferences and settings" }
  ];

  const dataUsagePurposes = [
    "Providing and maintaining the Service",
    "Managing Your Account",
    "Contract performance",
    "Communications and notifications",
    "Marketing and promotions (opt-out available)",
    "Responding to Your requests",
    "Business transfers and analytics"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, rgba(200, 162, 200, 0.05) 0%, rgba(216, 27, 96, 0.03) 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: '#C8A2C8', 
            fontStyle: 'italic',
            mb: 2
          }}>
            Privacy Policy
          </Typography>
          <Typography variant="h6" sx={{ color: 'black', mb: 3 }}>
            Last Updated: {lastUpdated}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="body1">
              This Privacy Policy outlines Our approach to collecting, using, and disclosing Your information when You interact with the Service. By accessing or using the Service, You consent to the collection and use of information as described here.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {quickLinks.map((link, index) => (
              <Chip
                key={index}
                label={link}
                variant="outlined"
                sx={{ 
                  color: '#d81b60', 
                  borderColor: '#d81b60',
                  fontWeight: 500
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Card sx={{ 
          p: { xs: 3, md: 6 }, 
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          {/* Introduction */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700 }}>
              Interpretation and Definitions
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8, mb: 3 }}>
              Words with their initial letter capitalized carry specific meanings as defined below. These definitions apply regardless of whether the terms are used in singular or plural form.
            </Typography>
            
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ color: '#C8A2C8' }}>
                  Key Definitions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Policy sx={{ color: '#d81b60' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Company"
                      secondary="Inceptra Digital Private Solution, 502, 5th Floor, Sethi Bhawan, Rajendra Place, New Delhi, Delhi - 110008"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security sx={{ color: '#d81b60' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Personal Data"
                      secondary="Any information relating to an identified or identifiable person"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DataUsage sx={{ color: '#d81b60' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Service"
                      secondary="Bandhnam Application and Website (bandhnam.com)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Cookie sx={{ color: '#d81b60' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cookies"
                      secondary="Small files placed on Your device storing browsing history and preferences"
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Data Collection Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700 }}>
              Collecting and Using Your Personal Data
            </Typography>
            
            <Typography variant="h5" sx={{ color: '#C8A2C8', mb: 2, fontWeight: 600 }}>
              Types of Data Collected
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d81b60', mb: 2 }}>
                Personal Data
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mb: 2, lineHeight: 1.7 }}>
                While using the Service, We may request certain personally identifiable details to contact or identify You:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#d81b60', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Email address" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#d81b60', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="First and last name" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#d81b60', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Phone number" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#d81b60', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary="Address, State, Province, ZIP/Postal code, City" />
                </ListItem>
              </List>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#d81b60', mb: 2 }}>
                Usage Data
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mb: 2, lineHeight: 1.7 }}>
                Collected automatically during Service use, including:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Card sx={{ p: 2, background: 'rgba(216, 27, 96, 0.05)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#d81b60' }}>
                    Device Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    IP address, browser type, device identifiers
                  </Typography>
                </Card>
                <Card sx={{ p: 2, background: 'rgba(216, 27, 96, 0.05)' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#d81b60' }}>
                    Usage Patterns
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    Pages visited, time spent, date and time of access
                  </Typography>
                </Card>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Third-Party Services */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700 }}>
              Information from Third-Party Social Media Services
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', mb: 3, lineHeight: 1.7 }}>
              You may create an account or log in using:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              {['Google', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                <Chip
                  key={platform}
                  label={platform}
                  variant="filled"
                  sx={{ 
                    background: 'linear-gradient(135deg, #d81b60, #880e4f)',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              ))}
            </Box>

            <Alert severity="info">
              <Typography variant="body2">
                If You register through these services, We may collect Personal Data already associated with those accounts, including name, email address, activity logs, or contact lists.
              </Typography>
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Cookies Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <Cookie sx={{ mr: 2 }} />
              Tracking Technologies and Cookies
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'black', mb: 3, lineHeight: 1.7 }}>
              We use Cookies and similar technologies to track activity and improve the Service.
            </Typography>

            <Box sx={{ mb: 3 }}>
              {cookieTypes.map((cookie, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: 600, color: '#C8A2C8' }}>
                      {cookie.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ color: 'black' }}>
                      {cookie.purpose}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(200, 162, 200, 0.1)' }}>
                <Typography variant="h6" sx={{ color: '#C8A2C8' }}>
                  Session Cookies
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  Deleted after browser closure
                </Typography>
              </Card>
              <Card sx={{ p: 2, textAlign: 'center', background: 'rgba(216, 27, 96, 0.1)' }}>
                <Typography variant="h6" sx={{ color: '#d81b60' }}>
                  Persistent Cookies
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  Remain stored until deleted manually
                </Typography>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Data Usage Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <DataUsage sx={{ mr: 2 }} />
              Use of Your Personal Data
            </Typography>

            <Typography variant="body1" sx={{ color: 'black', mb: 3, lineHeight: 1.7 }}>
              We may use Your Personal Data for purposes including:
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {dataUsagePurposes.map((purpose, index) => (
                <Card key={index} sx={{ p: 2, background: 'rgba(216, 27, 96, 0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#d81b60', mr: 2, mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'black' }}>
                      {purpose}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Data Sharing Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <Share sx={{ mr: 2 }} />
              Sharing of Your Data
            </Typography>

            <Alert severity="warning" sx={{ mb: 3 }}>
              Data may be shared with:
            </Alert>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Security sx={{ color: '#d81b60' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Service Providers"
                  secondary="For analytics, hosting, and communications"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Policy sx={{ color: '#d81b60' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Business Partners"
                  secondary="To provide promotions or services"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning sx={{ color: '#d81b60' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Legal Requirements"
                  secondary="When required by law or to protect rights"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Data Rights Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <Delete sx={{ mr: 2 }} />
              Your Data Rights
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, rgba(200, 162, 200, 0.1), rgba(216, 27, 96, 0.05))' }}>
                <Delete sx={{ fontSize: 40, color: '#C8A2C8', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#d81b60', mb: 1 }}>
                  Right to Delete
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  Request deletion of Your Personal Data at any time through account settings or by contacting Us
                </Typography>
              </Card>

              <Card sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05), rgba(200, 162, 200, 0.1))' }}>
                <PrivacyTip sx={{ fontSize: 40, color: '#d81b60', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#C8A2C8', mb: 1 }}>
                  Data Retention
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  Data retained only as long as necessary for stated purposes or legal obligations
                </Typography>
              </Card>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Children's Privacy */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700 }}>
              Children's Privacy
            </Typography>
            <Alert severity="error">
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                The Service is not directed at individuals under 13. We do not knowingly collect data from them.
              </Typography>
            </Alert>
            <Typography variant="body2" sx={{ color: 'black', mt: 2, lineHeight: 1.7 }}>
              If You believe a child has provided Personal Data, please contact Us. On verification, such data will be removed.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Security Section */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700 }}>
              Security of Your Personal Data
            </Typography>
            <Alert severity="info">
              <Typography variant="body1">
                We prioritize securing Your data using industry-standard measures. However, no internet transmission or storage method is completely secure. Absolute protection cannot be guaranteed.
              </Typography>
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Contact Information */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#d81b60', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ContactSupport sx={{ mr: 2 }} />
              Contact Us
            </Typography>
            <Card sx={{ p: 4, background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(200, 162, 200, 0.1) 100%)' }}>
              <Typography variant="h6" sx={{ color: '#d81b60', mb: 2 }}>
                For questions or concerns about this Privacy Policy:
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 600 }}>
                  Email:
                </Typography>
                <Link href="mailto:adm1.bandhnam@gmail.com" sx={{ color: '#d81b60' }}>
                  adm1.bandhnam@gmail.com
                </Link>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 600 }}>
                  Website:
                </Typography>
                <Link href="https://www.bandhnam.com" sx={{ color: '#d81b60' }}>
                  https://www.bandhnam.com
                </Link>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: 'black', fontWeight: 600 }}>
                  Company Address:
                </Typography>
                <Typography variant="body2" sx={{ color: 'black' }}>
                  Inceptra Digital Private Solution, 502, 5th Floor, Sethi Bhawan, Rajendra Place, New Delhi, Delhi - 110008
                </Typography>
              </Box>
            </Card>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Policy Updates */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="warning" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Changes to This Privacy Policy
              </Typography>
              <Typography variant="body2">
                We may update this Privacy Policy periodically. Changes will be communicated through posting the updated version here and via email notifications where applicable.
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #d81b60 0%, #880e4f 100%)',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                  }
                }}
              >
                Download Privacy Policy PDF
              </Button>
              
              <Button 
                variant="outlined"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  color: '#d81b60',
                  borderColor: '#d81b60',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'rgba(216, 27, 96, 0.1)',
                    borderColor: '#d81b60'
                  }
                }}
              >
                Cookie Preferences
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;