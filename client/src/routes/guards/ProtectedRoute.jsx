import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../config/routes';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
