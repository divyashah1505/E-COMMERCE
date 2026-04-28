import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../utils/tokenHelper';
import { PATHS } from '../../routes/routePaths';

const AdminAuthGuard = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return (
      <Navigate
        to={PATHS.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default AdminAuthGuard;