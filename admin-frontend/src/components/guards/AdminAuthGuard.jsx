import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/tokenHelper';
import { PATHS } from '../../routes/routePaths';

const AdminAuthGuard = ({ children }) => {
  const location = useLocation();
  // Use token existence as auth check; Redux state may not be synced instantly
  const token = getToken();

  if (!token) {
    // No token, redirect to login preserving intended destination
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Token exists, render protected content
  return children;
};

export default AdminAuthGuard;