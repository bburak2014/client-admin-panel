import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePostComments } from "@/features/comments/hooks/useComments";
import { usePost, useUpdatePost } from "../hooks/usePosts";
import type { Comment } from "@/features/comments/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNav } from "@/shared/utils/navigation";
import { useNotification } from "@/shared/hooks/useNotification";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import type { Permission } from "@/shared/types";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import Layout from "@/shared/components/Layout";
import Notification from "@/shared/components/Notification";

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNav();
  const postId = parseInt(id || "0");

  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = usePost(postId);
  const { data: comments, isLoading: commentsLoading } =
    usePostComments(postId);
  const updatePostMutation = useUpdatePost();
  const { hasPermission } = useAuth();

  type TabId = "view" | "edit" | "comments";
  const [activeTab, setActiveTab] = useState<TabId>("view");
  const [editForm, setEditForm] = useState({
    title: "",
    body: "",
  });

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  React.useEffect(() => {
    if (post) {
      setEditForm({
        title: post.title,
        body: post.body,
      });
    }
  }, [post]);

  if (postLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow mx-auto"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (postError || !post) {
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
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => nav.posts.go()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSave = async () => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        title: editForm.title,
        body: editForm.body,
        userId: post.userId,
      });
      showSuccess("Post Updated", "The post has been successfully updated.");
      setActiveTab("view");
    } catch (error) {
      console.error("Failed to update post:", error);
      showError("Update Failed", ERROR_MESSAGES.POSTS.UPDATE_FAILED);
    }
  };

  const tabs = [
    { id: "view", label: "View Post", icon: "👁️", permission: "VIEW_POSTS" },
    { id: "edit", label: "Edit Post", icon: "✏️", permission: "EDIT_POST" },
    {
      id: "comments",
      label: "Comments",
      icon: "💬",
      permission: "VIEW_COMMENTS",
    },
  ].filter(
    (tab) => !tab.permission || hasPermission(tab.permission as Permission),
  );

  return (
    <Layout>
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={4000}
      />

      <div className="mb-6 flex items-start justify-start">
        <button
          onClick={() => nav.posts.go()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium group"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Posts
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-3xl"></div>
        <div className="relative p-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">#{postId}</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Post Details
              </h1>
              <p className="text-gray-600 text-lg">
                View and manage your post content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
        <nav className="flex">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex-1 py-5 px-6 font-semibold text-sm transition-all duration-300 relative ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {activeTab === "view" && (
          <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    Post ID: {post.id}
                  </span>
                  <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    User ID: {post.userId}
                  </span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {post.body}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "edit" && (
          <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Edit Post
              </h2>
              <div className="space-y-8">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 text-lg"
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-body"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Content
                  </label>
                  <textarea
                    id="edit-body"
                    value={editForm.body}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, body: e.target.value }))
                    }
                    rows={12}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 resize-vertical transition-all duration-200 text-lg"
                    placeholder="Enter post content"
                  />
                </div>
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleSave}
                    disabled={updatePostMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-3"
                  >
                    {updatePostMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Comments
              </h2>
              {commentsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin-slow mx-auto"></div>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Loading comments...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments?.map((comment: Comment, index: number) => (
                    <div
                      key={comment.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 transform hover:scale-[1.02] transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {comment.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {comment.name}
                            </h4>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              {comment.email}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments?.length === 0 && (
                    <div className="text-center py-16">
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        No comments yet
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Be the first to comment on this post.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Post;
