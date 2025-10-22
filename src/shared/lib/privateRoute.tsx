import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type PrivateRouteProps = {
  isAuthenticated: boolean;
  children: ReactNode;
};

export default function PrivateRoute({ children, isAuthenticated }: PrivateRouteProps) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;

}
