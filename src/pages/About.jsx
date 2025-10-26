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
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Security,
  Payment,
  PrivacyTip,
  Gavel,
  ContactSupport,
  ArrowForward,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const importantPoints = [
    "Must be 18+ (women) or 21+ (men) to register",
    "Accurate information required during registration",
    "Platform for matrimonial purposes only",
    "Respect privacy and consent of other members",
    "Verify details independently before proceeding",
    "Report suspicious activity immediately"
  ];

  const contactInfo = {
    address: "502, 5th floor, Sethi Bhawan, Rajendra Place, New Delhi, Delhi - 110008",
    email: "adm1.bandhanam@gmail.com",
    website: "www.bandhanam.com"
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 0
      }
    }}>
      <Container maxWidth="false" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
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
            color: '#51365F',
            fontStyle: 'italic',
            mb: 2
          }}>
            Terms & Conditions
          </Typography>
          <Typography variant="h6" sx={{ color: 'black', mb: 3 }}>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Alert severity="info" sx={{
            mb: 3,
            textAlign: 'left',
            maxWidth: 800,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(136, 14, 79, 0.03) 100%)'
          }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Please read these Terms & Conditions carefully before using Bandhanam services.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
            {importantPoints.map((point, index) => (
              <Chip
                key={index}
                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                label={point}
                variant="outlined"
                sx={{
                  color: '#51365F',
                  borderColor: '#51365F',
                  fontWeight: 500,
                  background: 'rgba(255, 255, 255, 0.9)'
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
          background: 'rgba(255, 255, 255, 0.95)',
          mb: 6
        }}>
          {/* Introduction */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              Welcome to Bandhanam
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8, mb: 2, fontSize: '1.1rem' }}>
              Welcome to <strong>Bandhanam (bandhanam.com)</strong>, a matrimonial service designed to help individuals and families connect for the purpose of marriage. By accessing, registering, or using Bandhanam (through our website, mobile app, or any other platform), you agree to be bound by the following Terms & Conditions ("Terms").
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.8, fontWeight: 600, fontSize: '1.1rem' }}>
              Please read them carefully before proceeding. If you do not agree, you should not use our services.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 1: Eligibility */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <Gavel sx={{ mr: 2 }} />
              1. Eligibility
            </Typography>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="You must be at least 18 years of age (for women) and 21 years of age (for men) to register as per Indian law."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="By creating an account, you confirm that you are legally competent to marry under the applicable personal laws in India or your country of residence."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="You are registering either for yourself or on behalf of a family member with their consent."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Any misrepresentation of age, marital status, or personal details will result in suspension/termination of your account."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontWeight: 600, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Account Creation & Use */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              2. Account Creation & Use
            </Typography>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="You must provide accurate, complete, and updated information during registration."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Security sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="You are responsible for maintaining the confidentiality of your login credentials. Bandhanam is not liable for unauthorized use of your account."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Each account is for individual use only; multiple accounts for the same person are not allowed."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 3: Services */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              3. Services
            </Typography>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bandhanam provides both free and paid services."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Payment sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Certain premium features (such as direct messaging, priority listing, advanced filters, etc.) may only be available upon subscription."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Payments are non-refundable unless explicitly mentioned."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontWeight: 600, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 4: User Obligations */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              4. User Obligations
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              By using Bandhanam, you agree to:
            </Typography>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Use the platform only for matrimonial purposes."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Not misuse or harass other members."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Not post content that is false, offensive, illegal, obscene, discriminatory, or misleading."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Respect the privacy and consent of other members."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Violation of these rules may result in account suspension or permanent ban.
            </Alert>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 6: Privacy & Data Protection */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <PrivacyTip sx={{ mr: 2 }} />
              6. Privacy & Data Protection
            </Typography>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bandhanam values your privacy. All information collected is handled in accordance with our Privacy Policy."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <CheckCircle sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Information provided may be used for displaying your profile, enhancing matchmaking algorithms, and service improvements."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Security sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sensitive details (such as contact information) are shared only with your consent or through paid features."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 9: Limitation of Liability */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              9. Limitation of Liability
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Important: Bandhanam only provides a platform for matchmaking. We do not guarantee the accuracy, success, or outcome of any match.
              </Typography>
            </Alert>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Users are advised to verify personal and family details independently before proceeding with marriage discussions."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontWeight: 600, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Bandhanam is not responsible for misrepresentations by users, failed communications, rejections, disputes, or any damages incurred during interactions."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 10: Safety Guidelines */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              10. Safety Guidelines
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Your safety is our priority. Please follow these guidelines:
            </Alert>
            <List>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Security sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Do not share financial details or personal documents with other users without verification."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontWeight: 600, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Security sx={{ color: '#51365F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Meet in safe, public places before moving forward."
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontSize: '1.1rem' }}
                />
              </ListItem>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Warning sx={{ color: '#ff9800', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Report any suspicious activity immediately to adm1.bandhanam@gmail.com"
                  primaryTypographyProps={{ color: 'black', lineHeight: 1.7, fontWeight: 600, fontSize: '1.1rem' }}
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 13: Governing Law */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700 }}>
              13. Governing Law & Jurisdiction
            </Typography>
            <Typography variant="body1" sx={{ color: 'black', lineHeight: 1.7, fontStyle: 'italic', fontSize: '1.1rem' }}>
              These Terms shall be governed by and construed in accordance with the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts at New Delhi, India.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Section 15: Contact Information */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ color: '#51365F', mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ContactSupport sx={{ mr: 2 }} />
              15. Contact
            </Typography>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(216, 27, 96, 0.05) 0%, rgba(200, 162, 200, 0.1) 100%)',
              borderRadius: '20px'
            }}>
              <Typography variant="h6" sx={{ color: '#51365F', mb: 2 }}>
                Bandhanam
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mb: 1, fontSize: '1.1rem' }}>
                <strong>Address:</strong> {contactInfo.address}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mb: 1, fontSize: '1.1rem' }}>
                <strong>Email:</strong> {contactInfo.email}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mb: 1, fontSize: '1.1rem' }}>
                <strong>Website:</strong> {contactInfo.website}
              </Typography>
            </Card>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Final Acknowledgement */}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                By registering on Bandhanam, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    background: '#51365F',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #c2185b 0%, #6a1b9a 100%)'
                    }
                  }}
                >
                  I Agree - Continue to Register
                </Button>
              </Link>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  color: '#51365F',
                  borderColor: '#51365F',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'rgba(216, 27, 96, 0.1)',
                    borderColor: '#51365F'
                  }
                }}
              >
                Download Terms PDF
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <IconButton sx={{ color: '#51365F', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Facebook />
            </IconButton>
            <IconButton sx={{ color: '#51365F', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Instagram />
            </IconButton>
            <IconButton sx={{ color: '#51365F', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <Twitter />
            </IconButton>
            <IconButton sx={{ color: '#51365F', mx: 1, '&:hover': { backgroundColor: 'rgba(216, 27, 96, 0.1)' } }}>
              <LinkedIn />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: 'black' }}>
            © 2023 Bandhanam. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;