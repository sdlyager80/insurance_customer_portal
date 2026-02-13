import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Dashboard as DashboardIcon, Assignment, Person, ContactPhone } from '@mui/icons-material';
import { theme } from './theme';
import Dashboard from './pages/DashboardPremium';
import PolicyDetails from './pages/PolicyDetailsPremium';
import Actions from './pages/Actions';
import IllustrationDetails from './pages/IllustrationDetails';
import BloomLogo from './components/BloomLogo';
import ContactPreferences from './components/ContactPreferences';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Button
        component={Link}
        to="/"
        startIcon={<DashboardIcon />}
        color="inherit"
        sx={{
          mx: 1,
          fontWeight: isActive('/') ? 700 : 400,
          borderBottom: isActive('/') ? '2px solid white' : '2px solid transparent',
          borderRadius: 0,
          pb: 0.5,
        }}
      >
        Dashboard
      </Button>
      <Button
        component={Link}
        to="/actions"
        startIcon={<Assignment />}
        color="inherit"
        sx={{
          mx: 1,
          fontWeight: isActive('/actions') ? 700 : 400,
          borderBottom: isActive('/actions') ? '2px solid white' : '2px solid transparent',
          borderRadius: 0,
          pb: 0.5,
        }}
      >
        Actions
      </Button>
    </>
  );
};

function AppContent() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContactPreferencesOpen, setIsContactPreferencesOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleContactPreferencesOpen = () => {
    setIsContactPreferencesOpen(true);
    handleMenuClose();
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
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1.5} component={Link} to="/" sx={{ textDecoration: 'none' }}>
              <BloomLogo size={36} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: '#808285',
                  fontFamily: '"Roboto Slab", serif',
                }}
              >
                Bloom Insurance
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Navigation />
              <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
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
                <MenuItem onClick={handleContactPreferencesOpen}>
                  <ListItemIcon>
                    <ContactPhone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Contact Preferences</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1, bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/policy/:id" element={<PolicyDetails />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/illustration/:id" element={<IllustrationDetails />} />
        </Routes>
      </Box>

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
