import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from './hooks/redux';
import { selectAuthorizationStatus } from '../../features/auth/model/selectors';
import { AuthorizationStatus } from '../types/auth';
import Spinner from '../ui/Spinner/Spinner';

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return authorizationStatus === AuthorizationStatus.Authorized
    ? children
    : <Navigate to="/login" replace />;
}
