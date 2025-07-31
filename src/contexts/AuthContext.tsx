import { createContext, useContext, useState, ReactNode } from "react";
import { User, Permission } from "@/shared/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_FULL_PERMISSIONS: User = {
  name: "John Doe",
  permissions: [
    "VIEW_POSTS",
    "VIEW_COMMENTS",
    //  "EDIT_POST",
    //   "CREATE_POST"
  ],
};

const USER: User = USER_FULL_PERMISSIONS;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () =>
      queryClient.getQueryData<User | null>(["user"]) ?? null,
    initialData: null,
  });

  const isAuthenticated = !!user;

  const login = () => {
    setIsLoading(true);
    queryClient.setQueryData(["user"], USER);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    queryClient.setQueryData(["user"], null);
    setIsLoading(false);
  };

  const hasPermission = (permission: Permission) => {
    return user?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: Permission[]) => {
    return permissions.some((p) => hasPermission(p));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
