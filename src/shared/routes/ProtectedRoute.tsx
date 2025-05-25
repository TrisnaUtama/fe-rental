import { useAuthContext } from "@/shared/context/authContex";
import { Navigate } from "react-router-dom";
import type { Roles } from "@/shared/enum/enum";
import LoadingSpinner from "@/features/redirect/pages/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Roles[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <LoadingSpinner/>; 

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role as Roles))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
