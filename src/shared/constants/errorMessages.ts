export const ERROR_MESSAGES = {
  POSTS: {
    CREATE_FAILED: "Failed to create the post. Please try again.",
    UPDATE_FAILED: "Failed to update the post. Please try again.",
    DELETE_FAILED: "Failed to delete the post. Please try again.",
    LOAD_FAILED: "Failed to load posts. Please try again.",
  },
  COMMENTS: {
    CREATE_FAILED: "Failed to create the comment. Please try again.",
    UPDATE_FAILED: "Failed to update the comment. Please try again.",
    DELETE_FAILED: "Failed to delete the comment. Please try again.",
    LOAD_FAILED: "Failed to load comments. Please try again.",
  },
  AUTH: {
    LOGIN_FAILED: "Failed to login. Please try again.",
    LOGOUT_FAILED: "Failed to logout. Please try again.",
  },
  GENERAL: {
    NETWORK_ERROR: "Network error. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  },
} as const;
