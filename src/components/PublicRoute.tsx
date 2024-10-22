import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state?.auth?.token);

  return token ? <Navigate to="/user" /> : <>{children}</>;
};

export default PublicRoute;
