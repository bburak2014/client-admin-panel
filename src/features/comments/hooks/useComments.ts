import { useQuery } from "@tanstack/react-query";
import { commentsService } from "../services/commentsService";

export const commentKeys = {
  all: ["comments"] as const,
  recent: (limit: number) => [...commentKeys.all, "recent", limit] as const,
  byPost: (postId: number) => [...commentKeys.all, "byPost", postId] as const,
};

export function useRecentComments(limit: number = 5) {
  return useQuery({
    queryKey: commentKeys.recent(limit),
    queryFn: () => commentsService.getRecent(limit),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
}

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => commentsService.getByPostId(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
