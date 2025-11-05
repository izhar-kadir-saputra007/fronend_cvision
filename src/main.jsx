import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import './index.css'
import 'remixicon/fonts/remixicon.css'
import 'react-toastify/dist/ReactToastify.css';
import Toast from './components/Toast.jsx';

import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ErrorPage from './pages/404.jsx'
import ArtikelPage from './pages/ArtikelPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import TestPage from './pages/TestPage.jsx'
import UmumTestPage from './pages/UmumTestPage.jsx'
import PsikotestPage from './pages/PsikotestPage.jsx'
import PaymentPage from './pages/rekrutmen/CalonKaryawan/PaymentPage.jsx';
import KarirPage from './pages/rekrutmen/CalonKaryawan/KarirPage.jsx';
import RiwayatPage from './pages/rekrutmen/CalonKaryawan/RiwayatPage.jsx';
import LamaranUser from './pages/rekrutmen/CalonKaryawan/LamaranUser.jsx';
import ProfilePage from './pages/rekrutmen/CalonKaryawan/ProfilePage.jsx';
import RegisterAdminPT from './pages/rekrutmen/AdminPt/RegisterAdminPT.jsx';
import SettingPage from './pages/rekrutmen/CalonKaryawan/SettingPage.jsx';
import PremiumUpgradePage from './pages/PremiumUpgradePage.jsx';
import PanduanPengguna from "./pages/rekrutmen/PanduanPengguna.jsx"

import AdminPage from './pages/AdminPage.jsx'
import AdminEditUser from './pages/AdminEditUser.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminSetting from './pages/AdminSetting.jsx';
import ApplicantsByLowongan from './pages/rekrutmen/AdminPt/ApplicantsByLowongan.jsx';
import PaymentCallback from './pages/rekrutmen/AdminPt/PaymentCallback.jsx';

import { AdminPTRoutes } from './routers/adminPTRoutes.jsx';

const router = createBrowserRouter([

//router untuk payment callback


  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/register',
    element: <RegisterPage/>,
  },
  {
    path: '/register-adminpt',
    element: <RegisterAdminPT/>,
  },
  {
    path: '/artikel',
    element: <ArtikelPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  }, {
    path: '/test',
    element: <TestPage />,
  },{
    path: '/umumtest',
    element: <UmumTestPage />,
  },
  {
    path: '/psikotest',
    element: <PsikotestPage />,
  },
  {
    path: '/paymentPage',
    element: <PaymentPage />,
  },
  {
    path: '/karir',
    element: <KarirPage />,
  },
  {
    path: '/panduanpengguna',
    element: <PanduanPengguna />,
  },
  {
    path: '/premium',
    element: <PremiumUpgradePage />,
  },

  // Rute untuk halaman profil user
  {
    path: '/lamaranuser',
    element: <LamaranUser />,
  },
  {
    path: '/riwayat',
    element: <RiwayatPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/setting',
    element: <SettingPage />,
  },
  {
    path: '/applicants/:lowonganId',
    element: <ApplicantsByLowongan />,
   
  },

  {
    // Rute untuk halaman admin, hanya bisa diakses oleh pengguna yang sudah login
    path: '/admin',
    element: (
      <PrivateRoute 
        element={<AdminPage />} // Menggunakan PrivateRoute untuk memeriksa login
      />
    ),
  },
  {
    path: '/edit',
    element: (
      <PrivateRoute 
        element={<AdminEditUser />} // Menggunakan PrivateRoute untuk memeriksa login
      />
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute 
        element={<AdminDashboard />} // Menggunakan PrivateRoute untuk memeriksa login
      />
    ),
  },
  {
    path: '/setting',
    element: (
      <PrivateRoute 
        element={<AdminSetting />} // Menggunakan PrivateRoute untuk memeriksa login
      />
    ),
  },

  //router untuk payment callback
  

  // Rute untuk halaman admin PT, hanya bisa diakses oleh pengguna yang sudah login
  {
    path: '/adminpt/*', // Gunakan wildcard untuk nested routes
    element: <AdminPTRoutes />,
  },

  // Rute untuk callback pembayaran (taruh di luar nested routes)
  // Rute untuk callback pembayaran
  {
    path: '/payment-callback/:status',
    element: <PaymentCallback /> 
  } 

],
{
  future: {
    v7_startTransition: true,  
    v7_fetcherPersist: true    
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toast />
    <RouterProvider router={router} />
  </StrictMode>,
)
