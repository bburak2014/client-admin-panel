import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { routeConfigs } from "@/shared/config/routes";
import NotFoundPage from "@/shared/pages/NotFoundPage";

const Router: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderRouteElement = (route: any) => {
    if (route.element) {
      return route.element;
    }

    if (route.lazy) {
      const LazyComponent = React.lazy(route.lazy);
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyComponent />
        </Suspense>
      );
    }

    return <div>Route not found</div>;
  };

  return (
    <Routes>
      {routeConfigs.map((route) => (
        <Route
          key={route.name}
          path={route.path}
          element={renderRouteElement(route)}
        />
      ))}

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
