import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { preloadTranslations } from "../utils/translations";
import { Permission } from "@/shared/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
  translations?: (() => Promise<void>)[];
}

export default function ProtectedRoute({
  children,
  permissions = [],
  translations = [],
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasAnyPermission } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (translations.length > 0) {
      Promise.all(translations.map((fn) => fn())).catch(console.error);
    }
  }, [translations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
