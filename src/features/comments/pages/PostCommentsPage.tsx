import { useParams, Link } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import { usePost } from "@/features/posts/hooks/usePosts";
import { usePostComments } from "../hooks/useComments";
import { useNav } from "@/shared/utils/navigation";
import type { Comment } from "../types";

export default function PostCommentsPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNav();
  const postId = id ? parseInt(id, 10) : 0;

  const {
    data: post,
    isLoading: loadingPost,
    error: postError,
  } = usePost(postId);
  const {
    data: comments,
    isLoading: loadingComments,
    error: commentsError,
  } = usePostComments(postId);

  if (loadingPost) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (postError || !post) {
    return (
      <Layout>
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400">
            Error loading post: {postError?.message || "Post not found"}
          </div>
          <Link
            to={nav.posts.get()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-4 inline-block"
          >
            Back to Posts
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Comments
            </h1>
            <p className="text-gray-600 text-lg">
              View all comments for this post
            </p>
          </div>
          <Link
            to={nav.post.get({ id: post.id })}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                Post #{post.id}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                User {post.userId}
              </span>
              {comments && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {comments.length} comments
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Comments {comments && `(${comments.length})`}
          </h2>
        </div>

        {loadingComments ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : commentsError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 font-medium">
                Error loading comments: {commentsError.message}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {comments?.map((comment: Comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {comment.name}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {comment.email}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        #{comment.id}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {comments?.length === 0 && (
              <div className="text-center py-16">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No comments yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share your thoughts on this post!
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-blue-700 text-sm">
                    Comments will appear here once users start engaging with
                    this post.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
