import { Box, CssBaseline, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import AdminSidebar from './DashboardLayoutBasic';
import AdminHeader from './AdminHeader';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AdminHeader 
        drawerWidth={drawerWidth} 
        onMenuClick={handleDrawerToggle} 
      />
      <AdminSidebar 
        drawerWidth={drawerWidth}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { sm: `${drawerWidth}px` },
          backgroundColor: (theme) => theme.palette.background.default
        }}
      >
        <Toolbar /> {/* Spacer untuk AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;