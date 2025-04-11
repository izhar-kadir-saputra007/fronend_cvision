import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRouteAdminPT = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 
  
  if (!token || role !== 'adminPT') {
    // Jika tidak ada token atau role bukan admin, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token dan role adalah admin, tampilkan halaman yang dilindungi
  return children;
};

PrivateRouteAdminPT.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRouteAdminPT;