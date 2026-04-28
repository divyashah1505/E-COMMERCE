import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/tokenHelper';
import { PATHS } from '../../routes/routePaths';

const AdminAuthGuard = ({ children }) => {
  const location = useLocation();
  const token = getToken();
  // Retrieve auth state from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Determine effective authentication status (token or Redux flag)
  const effectiveAuth = token || isAuthenticated;
  console.log('AdminAuthGuard - token:', token, 'isAuthenticated:', isAuthenticated);
  if (!effectiveAuth) {
    // No auth info, redirect to login preserving intended destination
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Token exists, render protected content
  return children;
};

export default AdminAuthGuard;