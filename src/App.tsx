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
} from '@mui/material';
import { Dashboard as DashboardIcon, Assignment, Person } from '@mui/icons-material';
import { theme } from './theme';
import Dashboard from './pages/DashboardPremium';
import PolicyDetails from './pages/PolicyDetailsPremium';
import Actions from './pages/Actions';
import IllustrationDetails from './pages/IllustrationDetails';
import BloomLogo from './components/BloomLogo';

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
              <IconButton sx={{ ml: 2 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              </IconButton>
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
