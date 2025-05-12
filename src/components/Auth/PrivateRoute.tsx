import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;