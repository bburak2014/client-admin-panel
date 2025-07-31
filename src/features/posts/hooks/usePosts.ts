import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { postsService } from "../services/postsService";
import { env } from "@/config/environment";
import { logger } from "@/shared/utils/logger";
import type { CreatePostData, UpdatePostData, Post } from "../types";

const POSTS_KEY = ["posts"];

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  recent: (limit: number) => [...postKeys.all, "recent", limit] as const,
  infinite: () => [...postKeys.all, "infinite"] as const,
};

const updateCacheSafely = <T>(
  oldData: T | undefined,
  updater: (data: T) => T,
): T | undefined => {
  if (!oldData) return oldData;
  return updater(oldData);
};

const updateInfiniteCache = (
  oldData: InfiniteData<Post[]> | undefined,
  updater: (pages: Post[][]) => Post[][],
): InfiniteData<Post[]> | undefined => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: updater(oldData.pages),
  };
};

export function usePosts() {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: postsService.getAll,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function usePostsInfinite() {
  return useInfiniteQuery({
    queryKey: postKeys.infinite(),
    queryFn: ({ pageParam = 1 }) =>
      postsService.getPaginated(pageParam, env.pagination.postsPerPage),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < env.pagination.postsPerPage) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useRecentPosts(limit: number = 5) {
  return useQuery({
    queryKey: postKeys.recent(limit),
    queryFn: () => postsService.getRecent(limit),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postsService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsService.create,
    onSuccess: (newPost: Post) => {
      const createdPost = {
        id: newPost.id,
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
      };

      queryClient.setQueryData(postKeys.detail(createdPost.id), createdPost);

      queryClient.setQueryData(
        postKeys.infinite(),
        (oldData: InfiniteData<Post[]> | undefined) =>
          updateInfiniteCache(oldData, (pages) =>
            pages.map((page) =>
              page.length < env.pagination.postsPerPage
                ? [createdPost, ...page]
                : page,
            ),
          ),
      );

      queryClient.setQueryData(
        postKeys.lists(),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) => [createdPost, ...data]),
      );

      queryClient.setQueryData(
        postKeys.recent(5),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) =>
            [createdPost, ...data].slice(0, 5),
          ),
      );
    },
    onError: (error) => {
      logger.error("Failed to create post:", error);
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsService.update,
    onSuccess: (_, submittedData) => {
      const updatedPost = {
        id: submittedData.id,
        title: submittedData.title,
        body: submittedData.body,
        userId: submittedData.userId,
      };

      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);

      queryClient.setQueryData(
        postKeys.infinite(),
        (oldData: InfiniteData<Post[]> | undefined) =>
          updateInfiniteCache(oldData, (pages) =>
            pages.map((page) =>
              page.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            ),
          ),
      );

      queryClient.setQueryData(
        postKeys.lists(),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) =>
            data.map((post) =>
              post.id === updatedPost.id ? updatedPost : post,
            ),
          ),
      );

      queryClient.setQueryData(
        postKeys.recent(5),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) =>
            data.map((post) =>
              post.id === updatedPost.id ? updatedPost : post,
            ),
          ),
      );
    },
    onError: (error) => {
      logger.error("Failed to update post:", error);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsService.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId) });

      queryClient.setQueryData(
        postKeys.infinite(),
        (oldData: InfiniteData<Post[]> | undefined) =>
          updateInfiniteCache(oldData, (pages) =>
            pages.map((page) => page.filter((post) => post.id !== deletedId)),
          ),
      );

      queryClient.setQueryData(
        postKeys.lists(),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) =>
            data.filter((post) => post.id !== deletedId),
          ),
      );

      queryClient.setQueryData(
        postKeys.recent(5),
        (oldData: Post[] | undefined) =>
          updateCacheSafely(oldData, (data) =>
            data.filter((post) => post.id !== deletedId),
          ),
      );
    },
    onError: (error) => {
      logger.error("Failed to delete post:", error);
    },
  });
}
