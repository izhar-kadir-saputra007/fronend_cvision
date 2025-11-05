import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 180;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const CustomNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: '#00C3FE',

  width: '100%',
  '&.active': {
    '& .MuiListItemButton-root': {
      backgroundColor: "#19235c",
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  }
}));

export default function DashboardLayoutBasic({ navigation, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    console.log('User logged out');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: `calc(100% - ${open ? drawerWidth : 56}px)`,
          ml: `${open ? drawerWidth : 56}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: '#172048',
          color: 'white',
          boxShadow: 'rgba(0, 0, 0, 0.9) 0px 0px 20px',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit" 
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin PT
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{
          width: open ? drawerWidth : 56,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 56,
            boxSizing: 'border-box',
            boxShadow: "rgba(0, 0, 0, 0.9) 0px 0px 12px",
            backgroundColor: '#070F2B',
            position: 'fixed', // Mengubah dari 'relative' ke 'fixed'
            zIndex: theme.zIndex.drawer,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            overflowY: 'auto', // Mengatur overflow y ke auto
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
          },
        }}
        open={open}
        onClose={handleDrawerToggle}
      >
        {!isMobile && (
          <DrawerHeader
            sx={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'white',
              justifyContent: 'flex-end',
            }}
          >
            <IconButton sx={{ color: 'white' }} onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
        )}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Menu Navigasi */}
        <List sx={{ flexGrow: 1 }}>
          {navigation.map((item, index) => {
            if (item.segment === 'logout') return null;
            
            return (
              <ListItem key={`${item.segment}-${index}`} disablePadding>
                <CustomNavLink 
                  to={item.segment || '/'}
                  end
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title} 
                      sx={{ 
                        opacity: open ? 1 : 0, 
                        transition: 'opacity 0.3s', 
                        color: 'white',
                      }} 
                    />
                  </ListItemButton>
                </CustomNavLink>
              </ListItem>
            );
          })}
        </List>

        {/* Menu Logout */}
        <List sx={{ mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.26)' }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
               
                color: 'white',
                '&:hover': {
               bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'red',
                }}
              >
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ 
                  opacity: open ? 1 : 0, 
                  transition: 'opacity 0.3s', 
                  color: 'red',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'red.dark',
                  },
                }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${open ? drawerWidth-150 : 150}px)`,
          ml: `${open ? drawerWidth-150 : 50}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}