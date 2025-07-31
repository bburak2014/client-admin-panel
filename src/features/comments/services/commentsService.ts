import axiosInstance from "@/shared/services/axios";
import type { Comment } from "../types";

export const commentsService = {
  getRecent: async (limit: number): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/comments?_limit=${limit}`);
    return response.data;
  },

  getByPostId: async (postId: number): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    return response.data;
  },

  create: async (data: Omit<Comment, "id">): Promise<Comment> => {
    const response = await axiosInstance.post("/comments", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Comment>): Promise<Comment> => {
    const response = await axiosInstance.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
  },
};
