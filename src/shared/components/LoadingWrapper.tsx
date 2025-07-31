import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  message?: string;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  children,
  fallback,
  message,
}) => {
  if (isLoading) {
    return fallback || <LoadingSpinner message={message} />;
  }

  return <>{children}</>;
};

export default LoadingWrapper;
