import React from "react";
import { useRecentPosts } from "@/features/posts/hooks/usePosts";
import { useRecentComments } from "@/features/comments/hooks/useComments";
import type { Post } from "@/features/posts/types";
import type { Comment } from "@/features/comments/types";
import { useNav } from "@/shared/utils/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import Layout from "@/shared/components/Layout";

const Dashboard: React.FC = () => {
  const nav = useNav();
  const { hasPermission } = useAuth();
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useRecentPosts(5);
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useRecentComments(5);

  if (postsLoading || commentsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (postsError || commentsError) {
    return (
      <Layout>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">Failed to load dashboard data</p>
            {postsError && (
              <p className="text-sm text-red-500 mt-2">
                Posts Error: {postsError.message}
              </p>
            )}
            {commentsError && (
              <p className="text-sm text-red-500 mt-2">
                Comments Error: {commentsError.message}
              </p>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Debug logging to understand data structure
  console.log("Posts data:", posts);
  console.log("Comments data:", comments);

  // Ensure posts and comments are arrays, with fallback to empty arrays
  const recentPosts = Array.isArray(posts) ? posts.slice(0, 5) : [];
  const recentComments = Array.isArray(comments) ? comments.slice(0, 5) : [];

  return (
    <Layout>
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-black mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                Manage your blog posts, track comments, and create amazing
                content for your audience.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <span className="text-sm font-medium">
                    {recentPosts.length} Recent Posts
                  </span>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <span className="text-sm font-medium">
                    {recentComments.length} Recent Comments
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => nav.createPost.go()}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Post
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Posts</p>
              <p className="text-3xl font-bold">{posts?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Comments
              </p>
              <p className="text-3xl font-bold">{comments?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Active Users
              </p>
              <p className="text-3xl font-bold">1</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {hasPermission("VIEW_POSTS") && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Posts
                </h2>
              </div>
              <button
                onClick={() => nav.posts.go()}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                View All →
              </button>
            </div>
            <div className="space-y-6">
              {recentPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200"
                >
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3 text-sm">
                    {post.body}
                  </p>
                  <button
                    onClick={() => nav.post.go({ id: post.id })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
                  >
                    Read more →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasPermission("VIEW_COMMENTS") && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Comments
                </h2>
              </div>
            </div>
            <div className="space-y-6">
              {recentComments.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-xs">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {comment.name}
                      </h4>
                      <p className="text-gray-600 line-clamp-2 mb-2 text-sm">
                        {comment.body}
                      </p>
                      <p className="text-xs text-gray-500">{comment.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasPermission("VIEW_POSTS") && !hasPermission("VIEW_COMMENTS") && (
          <div className="col-span-full">
            <div className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Access
              </h3>
              <p className="text-gray-600">
                You don't have permission to view dashboard content.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
