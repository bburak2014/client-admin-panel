import React, { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  isVisible,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: "text-green-600",
          title: "text-green-800",
          message: "text-green-700",
          close: "text-green-400 hover:text-green-600",
        };
      case "error":
        return {
          bg: "bg-red-100 border-red-300 shadow-lg",
          icon: "text-red-600",
          title: "text-red-800",
          message: "text-red-700",
          close: "text-red-400 hover:text-red-600",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-600",
          title: "text-yellow-800",
          message: "text-yellow-700",
          close: "text-yellow-400 hover:text-yellow-600",
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-800",
          message: "text-blue-700",
          close: "text-blue-400 hover:text-blue-600",
        };
    }
  };

  const styles = getStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] max-w-sm w-full transform transition-all duration-300 ${
        isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className={`${styles.bg} border rounded-2xl shadow-xl p-4`}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${styles.title}`}>{title}</h3>
            {message && (
              <p className={`text-sm mt-1 ${styles.message}`}>{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${styles.close} transition-colors duration-200`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
