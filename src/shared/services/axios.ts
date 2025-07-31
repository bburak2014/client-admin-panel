import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { env } from "@/config/environment";
import { logger } from "@/shared/utils/logger";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.api.baseUrl,
  timeout: env.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    logger.api(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

    const token = localStorage.getItem(env.auth.tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logger.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.api(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    logger.error("❌ API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
    });

    if (error.response) {
      switch (error.response.status) {
        case 401:
          logger.error("🔒 Unauthorized access");

          break;
        case 403:
          logger.error("🚫 Access forbidden");
          break;
        case 404:
          logger.error("🔍 Resource not found");
          break;
        case 500:
          logger.error("💥 Server error");
          break;
        default:
          logger.error("⚠️ Unexpected error");
      }
    } else if (error.request) {
      logger.error("🌐 Network error - no response received");
    } else {
      logger.error("❓ Other error:", error.message);
    }

    const errorMessage =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "Network error";
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
    });
  },
);

export default axiosInstance;
