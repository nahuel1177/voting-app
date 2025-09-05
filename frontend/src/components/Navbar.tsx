import React, { useState, useMemo } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Stack,
  alpha,
  styled,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Groups as GroupsIcon,
  TableChart as TableChartIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,

  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)' 
    : 'rgba(17, 24, 39, 0.8)',
  backdropFilter: 'blur(8px)',
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 4),
  },
}));

type MenuItemType = {
  text: string;
  icon: React.ReactElement;
  path: string;
};

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar = ({ darkMode, onToggleDarkMode }: NavbarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const menuItems: MenuItemType[] = useMemo(
    () => [
      { text: 'Inicio', icon: <HomeIcon />, path: '/' },
      { text: 'Partidos', icon: <GroupsIcon />, path: '/parties' },
      { text: 'Mesas', icon: <TableChartIcon />, path: '/voting-tables' },
    ],
    []
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Votaciones
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path)
                    ? theme.palette.primary.main
                    : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              />
              {isActive(item.path) && (
                <ChevronRightIcon sx={{ opacity: 0.8, ml: 1 }} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          fullWidth
          onClick={onToggleDarkMode}
          startIcon={darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 3,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed" elevation={0}>
        <StyledToolbar>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              textDecoration: 'none',
              color: 'text.primary',
              mr: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Votar
          </Typography>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, ml: 2 }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                //startIcon={item.icon}
                className={isActive(item.path) ? 'active' : ''}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  padding: (theme) => theme.spacing(1.5, 2),
                  margin: (theme) => theme.spacing(0, 0.5),
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                  '&.active': {
                    color: 'primary.main',
                    backgroundColor: (theme) => theme.palette.primary.light + '1a',
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Stack>

          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Right side icons */}
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <Tooltip
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <IconButton
                onClick={onToggleDarkMode}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </StyledToolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            borderRight: 'none',
            backgroundColor: 'background.paper',
            boxShadow: theme.shadows[16],
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
