import { createTheme } from '@mui/material/styles';

// Bloom Insurance Brand Colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1B75BB', // Blue
      light: '#00ADEE', // Light Blue
      dark: '#808285', // Grey
    },
    secondary: {
      main: '#8BC53F', // Light Green
      light: '#E8DE23', // Yellow
      dark: '#37A526', // Green
    },
    success: {
      main: '#37A526', // Green
      light: '#8BC53F',
      dark: '#2d8a1f',
    },
    warning: {
      main: '#E8DE23', // Yellow
      light: '#eff44d',
      dark: '#d4c920',
    },
    error: {
      main: '#D02E2E', // Red
      light: '#e85c5c',
      dark: '#b12525',
    },
    info: {
      main: '#00ADEE', // Light Blue
      light: '#33bdff',
      dark: '#0096d1',
    },
    background: {
      default: '#F8F9FA',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#808285',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  breakpoints: {
    values: {
      xs: 0,      // Mobile portrait
      sm: 600,    // Mobile landscape
      md: 768,    // Tablet portrait
      lg: 1024,   // Tablet landscape / Desktop
      xl: 1440,   // Large desktop
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(1.75rem, 5vw, 3rem)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Roboto Slab", serif',
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.22)',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.22)',
    '0px 36px 72px rgba(0,0,0,0.24)',
    '0px 40px 80px rgba(0,0,0,0.26)',
    '0px 44px 88px rgba(0,0,0,0.28)',
    '0px 48px 96px rgba(0,0,0,0.3)',
    '0px 52px 104px rgba(0,0,0,0.32)',
    '0px 56px 112px rgba(0,0,0,0.34)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
          minHeight: 44,  // iOS/Android touch target minimum
          '@media (max-width: 768px)': {
            padding: '14px 20px',
            fontSize: '0.9375rem',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          padding: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});
