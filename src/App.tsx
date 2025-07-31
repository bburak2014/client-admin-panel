import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import GlobalLoading from "@/shared/components/GlobalLoading";
import { routeConfigs } from "@/shared/config/routes";
import { NotificationProvider } from "@/shared/contexts/NotificationContext";
import GlobalNotification from "@/shared/components/GlobalNotification";
import NotFoundPage from "@/shared/pages/NotFoundPage";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <div className="App">
          <GlobalLoading />
          <GlobalNotification />
          <Suspense fallback={<Loading />}>
            <Routes>
              {routeConfigs.map((route) => {
                const { name, path, element, lazy, permissions, translations } =
                  route;
                const needsAuth = permissions && permissions.length > 0;
                let routeElement: React.ReactElement;

                if (lazy) {
                  const LazyComponent = React.lazy(lazy);
                  routeElement = <LazyComponent />;
                } else if (element) {
                  routeElement = element;
                } else {
                  routeElement = <div>Route not found</div>;
                }

                if (needsAuth) {
                  routeElement = (
                    <ProtectedRoute
                      permissions={permissions}
                      translations={translations || []}
                    >
                      {routeElement}
                    </ProtectedRoute>
                  );
                }

                return <Route key={name} path={path} element={routeElement} />;
              })}

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

              {/* Catch-all route for 404 */}
              <Route
                path="*"
                element={
                  <React.Suspense fallback={<Loading />}>
                    <NotFoundPage />
                  </React.Suspense>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
