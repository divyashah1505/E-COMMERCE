import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/tokenHelper';
import { PATHS } from '../../routes/routePaths';

const AdminAuthGuard = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = getToken();

  // 1. No token → redirect immediately
  if (!token) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // 2. Token exists but Redux not ready → WAIT (prevents flicker redirect)
  if (!isAuthenticated && token) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading session...
      </div>
    );
  }

  return children;
};

export default AdminAuthGuard;