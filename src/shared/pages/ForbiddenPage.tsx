import React from "react";

import { useNav } from "@/shared/utils/navigation";

const Forbidden: React.FC = () => {
  const nav = useNav();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    nav.dashboard.go();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-gray-100">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-8xl font-black text-red-600 mb-4">403</h1>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Access Forbidden
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
