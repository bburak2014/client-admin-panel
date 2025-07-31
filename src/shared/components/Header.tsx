import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNav } from "@/shared/utils/navigation";

const Header: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const nav = useNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => nav.dashboard.go()}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Admin Panel
          </button>

          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => nav.dashboard.go()}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Dashboard
            </button>

            <button
              onClick={() => nav.posts.go()}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Posts
            </button>

            <button
              onClick={() => nav.createPost.go()}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Create Post
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm text-gray-700 font-medium">
              Welcome, {user.name}
            </span>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Logout
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute top-0 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"
                  }`}
                ></span>
                <span
                  className={`absolute top-2 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute top-4 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2.5" : "translate-y-0"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden border-t border-gray-200 bg-white transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                nav.dashboard.go();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Dashboard
            </button>

            <button
              onClick={() => {
                nav.posts.go();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Posts
            </button>

            <button
              onClick={() => {
                nav.createPost.go();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
            >
              Create Post
            </button>

            <div className="pt-2 border-t border-gray-200">
              <span className="block text-sm text-gray-500 px-3 py-2">
                Welcome, {user.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
