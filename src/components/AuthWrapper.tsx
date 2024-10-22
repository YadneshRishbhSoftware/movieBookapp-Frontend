import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
interface UserInfo {
    _id: string;
    email: string;
    role: string;
  }
  
  interface RootState {
    auth: {
      token: string;
      userInfo: UserInfo | null;
    };
  }
  
  interface AuthWrapperProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user';
    isPublic?: boolean;
  }
  
  const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
    children, 
    requiredRole,
    isPublic = false 
  }) => {
    const { token, userInfo } = useSelector((state: RootState) => state.auth);
  
    const isAuthorized = useMemo(() => {
      if (isPublic) return true;
      if (!token || !userInfo) return false;
      if (requiredRole && userInfo.role !== requiredRole) return false;
      return true;
    }, [token, userInfo?.role, requiredRole, isPublic]);
  
    if (!isAuthorized) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  };

  export default AuthWrapper