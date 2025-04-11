import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import PrivateRouteAdminPT from '../components/PrivateRoute/PrivateRouteAdminPT';
import DashboardLayoutBasic from '../components/rekrutmen/adminPT/DashboardLayoutBasic';
import Dashboard from '../pages/rekrutmen/AdminPt/Dashboard';
import CreatLowongan from '../pages/rekrutmen/AdminPt/CreatLowongan';
import {
  Dashboard as DashboardIcon,
  PostAdd as CreatLowonganIcon,
  People as ApplicantsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

// Konfigurasi menu navigasi
const ADMIN_PT_NAVIGATION = [
  {
    segment: 'dashboard', // Ubah dari string kosong
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'create-lowongan',
    title: 'Buat Lowongan',
    icon: <CreatLowonganIcon />,
  },
  {
    segment: 'applicants',
    title: 'Pelamar',
    icon: <ApplicantsIcon />,
  },
  {
    segment: 'settings',
    title: 'Pengaturan',
    icon: <SettingsIcon />,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
    action: () => {
      console.log('User logged out');
      window.location.href = '/login';
    },
  },
];

export const AdminPTRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRouteAdminPT>
            <DashboardLayoutBasic navigation={ADMIN_PT_NAVIGATION}>
              <Outlet />
            </DashboardLayoutBasic>
          </PrivateRouteAdminPT>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create-lowongan" element={<CreatLowongan />} />
        <Route path="settings" element={<CreatLowongan />} />
      </Route>
    </Routes>
  );
};