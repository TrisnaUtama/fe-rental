import { useAuthContext } from "@/shared/context/authContex";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
