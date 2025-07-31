import React, { useState } from "react";
import { useCreatePost } from "../hooks/usePosts";
import { useNav } from "@/shared/utils/navigation";
import { useNotification } from "@/shared/hooks/useNotification";
import { ERROR_MESSAGES } from "@/shared/constants/errorMessages";
import Layout from "@/shared/components/Layout";
import Notification from "@/shared/components/Notification";

interface FormData {
  title: string;
  body: string;
  userId: number;
}

interface FormErrors {
  title?: string;
  body?: string;
  userId?: string;
}

const CreatePost: React.FC = () => {
  const nav = useNav();
  const createPostMutation = useCreatePost();
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const userIds = Array.from({ length: 10 }, (_, i) => i + 1);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    body: "",
    userId: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be no more than 100 characters";
    }

    // Body validation
    if (!formData.body.trim()) {
      newErrors.body = "Content is required";
    } else if (formData.body.length < 10) {
      newErrors.body = "Content must be at least 10 characters";
    } else if (formData.body.length > 1000) {
      newErrors.body = "Content must be no more than 1000 characters";
    }

    // User ID validation
    if (!formData.userId || formData.userId <= 0) {
      newErrors.userId = "User ID must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userId" ? parseInt(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPostMutation.mutateAsync(formData);
      showSuccess("Post Created", "The post has been successfully created.");
      setTimeout(() => {
        nav.posts.go();
      }, 1500);
    } catch (error) {
      showError("Create Failed", ERROR_MESSAGES.POSTS.CREATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Create New Post
              </h1>
              <p className="text-gray-600 text-lg">
                Share your thoughts with the world
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
                  placeholder="Enter an engaging title for your post..."
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2">{errors.title}</p>
                )}
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
                  placeholder="Write your post content here... Share your thoughts, ideas, and experiences with the community."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.body && (
                    <p className="text-red-500 text-sm">{errors.body}</p>
                  )}
                  <span className="text-sm text-gray-500">
                    {formData.body.length}/1000 characters
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Author
                </label>
                <div className="relative">
                  <select
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className={`w-full py-4 pl-12 pr-12 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 text-lg appearance-none ${
                      errors.userId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    {userIds.map((id) => (
                      <option key={id} value={id}>
                        User {id}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </div>
                </div>
                {errors.userId && (
                  <p className="text-red-500 text-sm mt-2">{errors.userId}</p>
                )}
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || createPostMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-3"
                >
                  {isSubmitting || createPostMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Post...</span>
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Create Post</span>
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
};

export default CreatePost;
