import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment,
  LocalHospital,
  Calculate,
  Event,
  Menu as MenuLinesIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onFindCareClick: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

const Sidebar = ({ onFindCareClick, mobileOpen = false, onMobileClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(true); // Start minimized

  const isActive = (path: string) => location.pathname === path;

  // For mobile: show all items
  // For desktop: only show Find Care, Appointments, Calculator (Dashboard & Actions in header)
  const allMenuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      color: '#1976d2',
      special: false,
    },
    {
      path: '/actions',
      label: 'Actions',
      icon: <Assignment />,
      color: '#ed6c02',
      special: false,
    },
    {
      path: '/find-care',
      label: 'Find Care',
      icon: <LocalHospital />,
      color: '#2e7d32',
      special: true,
    },
    {
      path: '/my-appointments',
      label: 'My Appointments',
      icon: <Event />,
      color: '#9c27b0',
      special: false,
    },
    {
      path: '/coverage-calculator',
      label: 'Coverage Calculator',
      icon: <Calculate />,
      color: '#d32f2f',
      special: false,
    },
  ];

  const menuItems = isMobile ? allMenuItems : allMenuItems.slice(2); // Desktop: skip Dashboard & Actions

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.special) {
      onFindCareClick();
    } else {
      navigate(item.path);
    }
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Collapse Button (Desktop only) */}
      {!isMobile && (
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-end',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              cursor: 'pointer',
              transition: 'all 0.2s',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: 'scale(1.05)',
              },
            }}
          >
            <MenuLinesIcon sx={{ fontSize: 22, color: 'primary.main' }} />
          </Box>
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleItemClick(item)}
            sx={{
              mb: 1,
              borderRadius: 1,
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              position: 'relative',
              bgcolor: isActive(item.path) ? alpha(item.color, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: isActive(item.path) ? alpha(item.color, 0.12) : 'action.hover',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                bgcolor: item.color,
                opacity: isActive(item.path) ? 1 : 0,
                borderRadius: '0 2px 2px 0',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    fontSize: 22,
                  },
                }}
              >
                {item.icon}
              </Box>

              {/* Label - Hidden when collapsed */}
              {!collapsed && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: 'text.primary',
                  }}
                >
                  {item.label}
                </Typography>
              )}
            </Box>
          </ListItemButton>
        ))}
      </List>

      {/* Footer - Hidden when collapsed */}
      {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            Need help? Contact support
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            top: 64,
            height: 'calc(100vh - 64px)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
