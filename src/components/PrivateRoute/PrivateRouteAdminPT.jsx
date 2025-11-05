// src/components/PrivateRoute/PrivateRouteAdminPT.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const PrivateRouteAdminPT = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: null,
    isPremium: false,
    isLoading: true
  });
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const checkAuth = async () => {
      if (!token || role !== 'adminPT') {
        setAuthStatus({
          isAuthenticated: false,
          isPremium: false,
          isLoading: false
        });
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/check-premium`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAuthStatus({
          isAuthenticated: true,
          isPremium: response.data.isPremium,
          isLoading: false
        });
      } catch (error) {
        toast.error('Session expired, please login again');
        setAuthStatus({
          isAuthenticated: false,
          isPremium: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, [token, role]);

  if (authStatus.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!authStatus.isPremium) {
    return <Navigate to="/adminpt/upgrade" replace />;
  }

  return children;
};

PrivateRouteAdminPT.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRouteAdminPT;