import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { useNav } from "@/shared/utils/navigation";

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const nav = useNav();

  useEffect(() => {
    if (isAuthenticated) {
      nav.dashboard.go();
    }
  }, [isAuthenticated, nav]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-blue-500/20 transform rotate-45 animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-400/20 transform rotate-45 animate-float delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-blue-600/20 transform rotate-45 animate-float delay-1500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-blue-300/20 transform rotate-45 animate-float delay-3000"></div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-slate-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-xl font-medium">
              Sign in to continue your journey
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all duration-150 text-xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:scale-102 active:scale-98 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                <span className="animate-pulse">Signing in...</span>
              </div>
            ) : (
              "Sign in as John Doe"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
