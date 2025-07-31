import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { routeConfigs } from "@/shared/config/routes";
import { useGlobalNotification } from "@/shared/contexts/NotificationContext";

function buildPath(
  path: string,
  params: Record<string, string | number> = {},
): string {
  let builtPath = path;
  Object.entries(params).forEach(([key, value]) => {
    builtPath = builtPath.replace(`:${key}`, String(value));
  });
  return builtPath;
}

export const useNav = () => {
  const navigate = useNavigate();
  const { hasAnyPermission, user, isAuthenticated } = useAuth();
  const { showError } = useGlobalNotification();

  const createNavMethod = (routeName: string) => ({
    get: (params?: Record<string, string | number>) => {
      const route = routeConfigs.find((r) => r.name === routeName);
      if (!route) return "/";
      return params ? buildPath(route.path, params) : route.path;
    },

    go: (params?: Record<string, string | number>) => {
      const route = routeConfigs.find((r) => r.name === routeName);
      if (!route) return;

      // If route requires permissions but user is not authenticated, redirect to login
      if (route.permissions && !isAuthenticated) {
        navigate("/login");
        return;
      }

      if (route.permissions && !hasAnyPermission(route.permissions)) {
        showError(
          "Access Denied",
          "You don't have permission to access this page. Please contact your administrator if you believe this is an error.",
        );
        return;
      }

      const path = params ? buildPath(route.path, params) : route.path;
      navigate(path);
    },
  });

  const nav: Record<string, { get: Function; go: Function }> = {};

  routeConfigs.forEach((route) => {
    nav[route.name] = createNavMethod(route.name);
  });

  return nav as {
    dashboard: {
      get: (params?: Record<string, string | number>) => string;
      go: (params?: Record<string, string | number>) => void;
    };
    posts: {
      get: (params?: Record<string, string | number>) => string;
      go: (params?: Record<string, string | number>) => void;
    };
    post: {
      get: (params: { id: number }) => string;
      go: (params: { id: number }) => void;
    };
    editPost: {
      get: (params: { id: number }) => string;
      go: (params: { id: number }) => void;
    };
    createPost: { get: () => string; go: () => void };
    postComments: {
      get: (params: { id: number }) => string;
      go: (params: { id: number }) => void;
    };
    login: { get: () => string; go: () => void };
    forbidden: { get: () => string; go: () => void };
    notFound: { get: () => string; go: () => void };
  };
};
