import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/shared/components/Layout";
import Notification from "@/shared/components/Notification";
import { usePost, useUpdatePost } from "../hooks/usePosts";
import { useNav } from "@/shared/utils/navigation";
import { useNotification } from "@/shared/hooks/useNotification";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import type { PostFormData } from "../types";

interface FormErrors {
  title?: string;
  body?: string;
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNav();
  const postId = id ? parseInt(id, 10) : 0;

  const {
    data: post,
    isLoading: loadingPost,
    error: postError,
  } = usePost(postId);
  const {
    mutate: updatePost,
    isPending: isUpdating,
    error: updateError,
  } = useUpdatePost();

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when post loads
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be no more than 100 characters";
    } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(formData.title)) {
      newErrors.title = "Title contains invalid characters";
    }

    // Body validation
    if (!formData.body.trim()) {
      newErrors.body = "Content is required";
    } else if (formData.body.length < 10) {
      newErrors.body = "Content must be at least 10 characters";
    } else if (formData.body.length > 1000) {
      newErrors.body = "Content must be no more than 1000 characters";
    } else if (formData.body.trim().split(/\s+/).length < 3) {
      newErrors.body = "Content must contain at least 3 words";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Title is required";
        } else if (value.length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        } else if (value.length > 100) {
          newErrors.title = "Title must be no more than 100 characters";
        } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(value)) {
          newErrors.title = "Title contains invalid characters";
        } else {
          delete newErrors.title;
        }
        break;

      case "body":
        if (!value.trim()) {
          newErrors.body = "Content is required";
        } else if (value.length < 10) {
          newErrors.body = "Content must be at least 10 characters";
        } else if (value.length > 1000) {
          newErrors.body = "Content must be no more than 1000 characters";
        } else if (value.trim().split(/\s+/).length < 3) {
          newErrors.body = "Content must contain at least 3 words";
        } else {
          delete newErrors.body;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve, reject) => {
        updatePost(
          {
            id: post.id,
            title: formData.title,
            body: formData.body,
            userId: post.userId,
          },
          {
            onSuccess: () => {
              showSuccess(
                "Post Updated",
                "The post has been successfully updated.",
              );
              setTimeout(() => {
                nav.posts.go();
              }, 1500);
              resolve();
            },
            onError: (error) => {
              showError("Update Failed", ERROR_MESSAGES.POSTS.UPDATE_FAILED);
              reject(error);
            },
            onSettled: () => {
              setIsSubmitting(false);
            },
          },
        );
      });
    } catch (error) {
      // Error already handled in onError callback
    }
  };

  if (loadingPost) {
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
              The post you're trying to edit doesn't exist.
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Edit Post
              </h1>
              <p className="text-gray-600 text-lg">
                Update your post content and information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 text-lg ${
                    errors.title ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter post title"
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                  <span
                    className={`text-sm ${formData.title.length > 80 ? "text-orange-500" : "text-gray-500"}`}
                  >
                    {formData.title.length}/100 characters
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Content
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows={12}
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 resize-vertical transition-all duration-200 text-lg ${
                    errors.body ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter post content"
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.body && (
                    <p className="text-red-500 text-sm">{errors.body}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${formData.body.length > 900 ? "text-orange-500" : "text-gray-500"}`}
                    >
                      {formData.body.length}/1000 characters
                    </span>
                    <span
                      className={`text-sm ${formData.body.trim().split(/\s+/).length < 3 ? "text-orange-500" : "text-green-500"}`}
                    >
                      {formData.body.trim().split(/\s+/).length} words
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={
                    isSubmitting || isUpdating || Object.keys(errors).length > 0
                  }
                  className={`font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-3 ${
                    Object.keys(errors).length > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  }`}
                >
                  {isSubmitting || isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
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
                      <span>Update Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
