import React from "react";
import { useGlobalNotification } from "@/shared/contexts/NotificationContext";
import Notification from "./Notification";

const GlobalNotification: React.FC = () => {
  const { notification, hideNotification } = useGlobalNotification();

  return (
    <Notification
      type={notification.type}
      title={notification.title}
      message={notification.message}
      isVisible={notification.isVisible}
      onClose={hideNotification}
      duration={4000}
    />
  );
};

export default GlobalNotification;
