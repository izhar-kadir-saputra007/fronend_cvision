import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 
  if (!token || role !== 'admin') {
    // Jika tidak ada token atau role bukan admin, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  // Jika ada token dan role adalah admin, tampilkan halaman yang dilindungi
  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
