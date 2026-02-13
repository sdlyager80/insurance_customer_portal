import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { Person, ContactPhone, Dashboard as DashboardIcon, Assignment, LocalHospital, Event, Calculate, KeyboardArrowDown } from '@mui/icons-material';
import { theme } from './theme';
import Dashboard from './pages/DashboardPremium';
import PolicyDetails from './pages/PolicyDetailsPremium';
import Actions from './pages/Actions';
import IllustrationDetails from './pages/IllustrationDetails';
import CoverageCalculatorPage from './pages/CoverageCalculatorPage';
import FindCare from './pages/FindCare';
import MyAppointments from './pages/MyAppointments';
import Emergency from './pages/Emergency';
import BloomLogo from './components/BloomLogo';
import ContactPreferences from './components/ContactPreferences';
import CareOptionsModal from './components/CareOptionsModal';
import { AnnualEnrollmentBanner } from './components/AnnouncementBanner';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(null);
  const [isContactPreferencesOpen, setIsContactPreferencesOpen] = useState(false);
  const [careOptionsModalOpen, setCareOptionsModalOpen] = useState(false);
  const [showAnnualEnrollmentBanner, setShowAnnualEnrollmentBanner] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleServicesMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleServicesMenuClose = () => {
    setServicesAnchorEl(null);
  };

  const handleContactPreferencesOpen = () => {
    setIsContactPreferencesOpen(true);
    handleMenuClose();
  };

  const handleFindCareClick = () => {
    setCareOptionsModalOpen(true);
    handleServicesMenuClose();
  };

  const handleNavigateToAppointments = () => {
    navigate('/my-appointments');
    handleServicesMenuClose();
  };

  const handleNavigateToCalculator = () => {
    navigate('/coverage-calculator');
    handleServicesMenuClose();
  };

  const handleViewPolicy = () => {
    // Navigate to first policy (in real app, would show policy selection or default policy)
    navigate('/policy/life-001');
  };

  const handleWatchVideo = () => {
    // Open video in new tab (in real app, would open video modal or player)
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const handleDismissBanner = () => {
    setShowAnnualEnrollmentBanner(false);
    // Store dismissal in localStorage so it persists
    localStorage.setItem('annualEnrollmentBannerDismissed', 'true');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'primary.main',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{
            justifyContent: 'space-between',
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: { xs: 56, sm: 64 },
            gap: { xs: 2, sm: 3, md: 4 },
          }}>
            {/* Logo and Brand */}
            <Box display="flex" alignItems="center" gap={1.5} component={Link} to="/" sx={{ textDecoration: 'none', flex: 1 }}>
              <Box sx={{ width: { xs: 28, sm: 36 }, height: { xs: 28, sm: 36 } }}>
                <BloomLogo size={36} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: '#808285',
                  fontFamily: '"Roboto Slab", serif',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  whiteSpace: 'nowrap',
                }}
              >
                Bloom Insurance
              </Typography>
            </Box>

            {/* Right Side: Navigation + Services Dropdown + User Avatar */}
            <Box display="flex" alignItems="center" gap={1}>
              {/* Dashboard & Actions */}
              <Button
                component={Link}
                to="/"
                startIcon={<DashboardIcon />}
                sx={{
                  color: 'inherit',
                  fontWeight: isActive('/') ? 700 : 500,
                  borderBottom: isActive('/') ? '2px solid' : '2px solid transparent',
                  borderColor: 'primary.main',
                  borderRadius: 0,
                  px: 2,
                  minHeight: 44,
                  display: { xs: 'none', sm: 'flex' },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/actions"
                startIcon={<Assignment />}
                sx={{
                  color: 'inherit',
                  fontWeight: isActive('/actions') ? 700 : 500,
                  borderBottom: isActive('/actions') ? '2px solid' : '2px solid transparent',
                  borderColor: 'primary.main',
                  borderRadius: 0,
                  px: 2,
                  minHeight: 44,
                  display: { xs: 'none', sm: 'flex' },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                Actions
              </Button>

              {/* Services Dropdown */}
              <Button
                onClick={handleServicesMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: 'inherit',
                  fontWeight: 500,
                  px: 2,
                  minHeight: 44,
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                Services
              </Button>

              {/* User Avatar */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  ml: { xs: 1, sm: 2 },
                  minWidth: 44,
                  minHeight: 44,
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                <Avatar sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem
                  onClick={handleContactPreferencesOpen}
                  sx={{
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                >
                  <ListItemIcon>
                    <ContactPhone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Contact Preferences</ListItemText>
                </MenuItem>
              </Menu>

              {/* Services Menu */}
              <Menu
                anchorEl={servicesAnchorEl}
                open={Boolean(servicesAnchorEl)}
                onClose={handleServicesMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 240,
                  },
                }}
              >
                <MenuItem
                  onClick={handleFindCareClick}
                  sx={{
                    py: 1.5,
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                >
                  <ListItemIcon>
                    <LocalHospital fontSize="small" sx={{ color: '#2e7d32' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Find Care"
                    secondary="Search for providers"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleNavigateToAppointments}
                  sx={{
                    py: 1.5,
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Event fontSize="small" sx={{ color: '#9c27b0' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Appointments"
                    secondary="View appointments"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleNavigateToCalculator}
                  sx={{
                    py: 1.5,
                    '&:focus': {
                      outline: 'none',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Calculate fontSize="small" sx={{ color: '#d32f2f' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Coverage Calculator"
                    secondary="Calculate coverage"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Annual Enrollment Banner */}
      {showAnnualEnrollmentBanner && (
        <AnnualEnrollmentBanner
          onViewPolicy={handleViewPolicy}
          onWatchVideo={handleWatchVideo}
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/find-care" element={<FindCare />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/policy/:id" element={<PolicyDetails />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/coverage-calculator" element={<CoverageCalculatorPage />} />
            <Route path="/illustration/:id" element={<IllustrationDetails />} />
          </Routes>
        </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2026 Insurance Portal. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <ContactPreferences
        open={isContactPreferencesOpen}
        onClose={() => setIsContactPreferencesOpen(false)}
        userEmail="customer@bloominsurance.com"
      />

      <CareOptionsModal
        open={careOptionsModalOpen}
        onClose={() => setCareOptionsModalOpen(false)}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
