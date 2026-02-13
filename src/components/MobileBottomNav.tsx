import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, LocalHospital, Description, Article } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

interface MobileBottomNavProps {
  onFindCareClick?: () => void;
}

const MobileBottomNav = ({ onFindCareClick }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }

  const getCurrentValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/find-care') return 1;
    if (path === '/actions') return 2;
    if (path === '/letter-of-guarantee') return 3;
    return 0;
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        if (onFindCareClick) {
          onFindCareClick();
        } else {
          navigate('/find-care');
        }
        break;
      case 2:
        navigate('/actions');
        break;
      case 3:
        navigate('/letter-of-guarantee');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label="Find Care"
          icon={<LocalHospital />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label="Submit Claim"
          icon={<Description />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
        <BottomNavigationAction
          label="Letter of Guarantee"
          icon={<Article />}
          sx={{
            '&.Mui-selected': {
              color: 'primary.main',
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
