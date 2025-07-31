import axiosInstance from "@/shared/services/axios";
import type { Post, CreatePostData, UpdatePostData } from "../types";

export const postsService = {
  getAll: async (): Promise<Post[]> => {
    const response = await axiosInstance.get("/posts");
    return response.data;
  },

  getPaginated: async (page: number, limit: number): Promise<Post[]> => {
    const response = await axiosInstance.get(
      `/posts?_page=${page}&_limit=${limit}`,
    );
    return response.data;
  },

  getRecent: async (limit: number): Promise<Post[]> => {
    const response = await axiosInstance.get(`/posts?_limit=${limit}`);
    return response.data;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: CreatePostData): Promise<Post> => {
    const response = await axiosInstance.post("/posts", data);
    return response.data;
  },

  update: async (data: UpdatePostData): Promise<Post> => {
    const response = await axiosInstance.put(`/posts/${data.id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  },
};
