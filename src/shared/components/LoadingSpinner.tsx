import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "md",
  className = "min-h-screen",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mx-auto mb-4`}
        ></div>
        {message && <p className="text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
