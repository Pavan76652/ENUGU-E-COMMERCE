import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../config/routes';

const SuperAdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SUPER_ADMIN_LOGIN} replace />;
  }

  if (role !== ROLES.SUPER_ADMIN) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
};

export default SuperAdminRoute;
