import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  FitnessCenter as GymIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Inventory as InventoryIcon,
  Work as WorkIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [mobileAnchor, setMobileAnchor] = useState(null);
  const openMobile = Boolean(mobileAnchor);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileClick = (event) => {
    setMobileAnchor(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchor(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Gestión de Usuarios',
      icon: <PeopleIcon fontSize="small" />,
      items: [
        { label: 'Usuarios', path: '/usuario' },
        { label: 'Clientes', path: '/cliente' },
        { label: 'Roles', path: '/rol' }
      ]
    },
    {
      title: 'Inventario y Equipos',
      icon: <InventoryIcon fontSize="small" />,
      items: [
        { label: 'Categorías de Equipos', path: '/categoria-equipo' },
        { label: 'Equipos', path: '/equipo' },
        { label: 'Mantenimientos', path: '/mantenimiento' }
      ]
    },
    {
      title: 'Membresías y Pagos',
      icon: <PaymentIcon fontSize="small" />,
      items: [
        { label: 'Planes de Membresía', path: '/plan-membresia' },
        { label: 'Membresías', path: '/membresia' },
        { label: 'Pagos', path: '/pago' }
      ]
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo y nombre */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => navigate('/')}
          >
            <GymIcon sx={{ fontSize: 40, mr: 1.5, color: 'white' }} />
            <Box>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  color: 'white'
                }}
              >
                Gimnasio Aesthetic
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.7rem'
                }}
              >
                Sistema de Gestión
              </Typography>
            </Box>
          </Box>

          {/* Botones de navegación */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!isMobile ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    },
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Inicio
                </Button>

                <Button
                  variant="contained"
                  startIcon={<DashboardIcon />}
                  onClick={handleMenuClick}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    },
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  Menú de Gestión
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    textTransform: 'none'
                  }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // Mobile: single menu button that includes navigation and logout
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMobileClick}
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileAnchor}
                  open={openMobile}
                  onClose={handleMobileClose}
                  PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2 } }}
                >
                  <MenuItem onClick={() => { navigate('/'); handleMobileClose(); }}>Inicio</MenuItem>
                  <Divider />
                  {menuItems.map((section, idx) => (
                    <Box key={idx} sx={{ px: 1 }}>
                      <MenuItem disabled sx={{ opacity: 1, py: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {section.icon}
                          <Typography variant="subtitle2" fontWeight={700}>
                            {section.title}
                          </Typography>
                        </Box>
                      </MenuItem>
                      {section.items.map((item, itemIdx) => (
                        <MenuItem key={itemIdx} onClick={() => { handleNavigate(item.path); handleMobileClose(); }} sx={{ pl: 4 }}>
                          {item.label}
                        </MenuItem>
                      ))}
                      {idx < menuItems.length - 1 && <Divider sx={{ my: 0.5 }} />}
                    </Box>
                  ))}
                  <Divider />
                  <MenuItem onClick={() => { handleLogout(); handleMobileClose(); }}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }
        }}
      >
        {menuItems.map((section, idx) => (
          <Box key={idx}>
            <MenuItem disabled sx={{ opacity: '1 !important', py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {section.icon}
                <Typography variant="subtitle2" fontWeight={700} color="primary">
                  {section.title}
                </Typography>
              </Box>
            </MenuItem>
            {section.items.map((item, itemIdx) => (
              <MenuItem 
                key={itemIdx}
                onClick={() => handleNavigate(item.path)}
                sx={{ 
                  pl: 4,
                  '&:hover': { 
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                {item.label}
              </MenuItem>
            ))}
            {idx < menuItems.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navbar;