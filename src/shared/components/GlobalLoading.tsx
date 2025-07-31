import React from "react";
import { useGlobalLoading } from "@/shared/hooks/useGlobalLoading";

const GlobalLoading: React.FC = () => {
  const { isLoading, message, progress } = useGlobalLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6 shadow-lg"></div>

          {message && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg font-medium">
              {message}
            </p>
          )}

          {progress !== undefined && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {progress !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {progress}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
