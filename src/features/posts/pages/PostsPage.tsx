import React, { useState } from "react";
import { usePostsInfinite, useDeletePost } from "../hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import { useNav } from "@/shared/utils/navigation";
import { useGlobalNotification } from "@/shared/contexts/NotificationContext";

import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import Layout from "@/shared/components/Layout";
import Notification from "@/shared/components/Notification";

const Posts: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsInfinite();
  const deletePostMutation = useDeletePost();
  const { hasPermission } = useAuth();
  const nav = useNav();

  const { showSuccess, showError } = useGlobalNotification();
  const [deletingPosts, setDeletingPosts] = useState<Set<number>>(new Set());

  const posts = data?.pages.flat() || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow mx-auto"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Failed to Load Posts
            </h2>
            <p className="text-gray-600 mb-6">
              Something went wrong while loading the posts.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDelete = async (id: number) => {
    if (!hasPermission("EDIT_POST")) {
      showError(
        "Access Denied",
        "You don't have permission to delete posts. Please contact your administrator if you believe this is an error.",
      );
      return;
    }

    setDeletingPosts((prev) => new Set(prev).add(id));

    try {
      await deletePostMutation.mutateAsync(id);
      showSuccess("Post Deleted", "The post has been successfully deleted.");
    } catch (error) {
      console.error("Failed to delete post:", error);
      showError("Delete Failed", ERROR_MESSAGES.POSTS.DELETE_FAILED);
    } finally {
      setDeletingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <Layout>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-3xl"></div>
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Blog Posts
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and explore your content
                </p>
              </div>
            </div>

            <button
              onClick={() => nav.createPost.go()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Create Post</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-all duration-200"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        #{post.id}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Post ID: {post.id}
                        </span>
                        <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          User ID: {post.userId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-6">
                    <p className="text-gray-700 leading-relaxed text-lg line-clamp-3">
                      {post.body}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end lg:justify-start lg:flex-col gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => nav.post.go({ id: post.id })}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 justify-start space-x-2 min-w-[80px]"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => nav.editPost.go({ id: post.id })}
                    className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-semibold px-6 py-3 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 justify-start space-x-2 min-w-[80px]"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingPosts.has(post.id)}
                    className="bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 font-semibold px-6 py-3 rounded-2xl transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 justify-start space-x-2 min-w-[80px]"
                  >
                    {deletingPosts.has(post.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent flex-shrink-0"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center space-x-3"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span>Load More Posts</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-16 lg:py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No posts found
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Get started by creating your first post.
          </p>
          <button
            onClick={() => nav.createPost.go()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Create Your First Post
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Posts;
