import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../utils/tokenHelper';
import { PATHS } from '../../routes/routePaths';

const AdminAuthGuard = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const token = getToken();

  // IMPORTANT: wait for Redux hydration
  if (!token) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // prevent flicker when redux is still updating
  if (!isAuthenticated && token) {
    return <div className="flex items-center justify-center h-screen">
      Loading session...
    </div>;
  }

  return children;
};

export default AdminAuthGuard;