import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface NotificationState {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  isVisible: boolean;
}

interface NotificationContextType {
  notification: NotificationState;
  showNotification: (
    type: NotificationState["type"],
    title: string,
    message?: string,
  ) => void;
  hideNotification: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const initialNotificationState: NotificationState = {
  type: "info",
  title: "",
  message: "",
  isVisible: false,
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>(
    initialNotificationState,
  );

  const showNotification = useCallback(
    (type: NotificationState["type"], title: string, message?: string) => {
      setNotification({
        type,
        title,
        message,
        isVisible: true,
      });
    },
    [],
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showNotification("success", title, message);
    },
    [showNotification],
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showNotification("error", title, message);
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showNotification("warning", title, message);
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showNotification("info", title, message);
    },
    [showNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notification,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useGlobalNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useGlobalNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
