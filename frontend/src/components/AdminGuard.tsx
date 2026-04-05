import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { MyUserContext } from '../services/MyContexts.ts';
import type { User } from '../types/user';

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const user = useContext(MyUserContext) as User | null;

  // Check if user is authenticated and has ADMIN role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
