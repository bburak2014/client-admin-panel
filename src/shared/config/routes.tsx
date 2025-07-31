import React from "react";
import { Permission } from "@/shared/types";
import LoginPage from "@/features/auth/pages/LoginPage";
import ForbiddenPage from "@/shared/pages/ForbiddenPage";
import NotFoundPage from "@/shared/pages/NotFoundPage";

interface RouteConfig {
  name: string;
  path: string;
  element?: React.ReactElement;
  lazy?: () => Promise<{ default: React.ComponentType }>;
  permissions?: Permission[];
  translations?: (() => Promise<void>)[];
}

const loadTranslations = (language: string) => () => Promise.resolve();

export const routeConfigs: RouteConfig[] = [
  {
    name: "login",
    path: "/login",
    element: <LoginPage />,
    translations: [loadTranslations("en")],
  },
  {
    name: "dashboard",
    path: "/dashboard",
    lazy: () => import("@/features/dashboard/pages/HomePage"),
    permissions: ["VIEW_POSTS", "VIEW_COMMENTS"],
    translations: [loadTranslations("en")],
  },
  {
    name: "posts",
    path: "/posts",
    lazy: () => import("@/features/posts/pages/PostsPage"),
    permissions: ["VIEW_POSTS"],
    translations: [loadTranslations("en")],
  },
  {
    name: "post",
    path: "/posts/:id",
    lazy: () => import("@/features/posts/pages/PostPage"),
    permissions: ["VIEW_POSTS"],
    translations: [loadTranslations("en")],
  },
  {
    name: "editPost",
    path: "/posts/:id/edit",
    lazy: () => import("@/features/posts/pages/EditPostPage"),
    permissions: ["EDIT_POST"],
    translations: [loadTranslations("en")],
  },
  {
    name: "createPost",
    path: "/posts/create",
    lazy: () => import("@/features/posts/pages/CreatePostPage"),
    permissions: ["CREATE_POST"],
    translations: [loadTranslations("en")],
  },
  {
    name: "postComments",
    path: "/posts/:id/comments",
    lazy: () => import("@/features/comments/pages/PostCommentsPage"),
    permissions: ["VIEW_COMMENTS"],
    translations: [loadTranslations("en")],
  },
  {
    name: "forbidden",
    path: "/403",
    element: <ForbiddenPage />,
    translations: [loadTranslations("en")],
  },
  {
    name: "notFound",
    path: "/404",
    element: <NotFoundPage />,
    translations: [loadTranslations("en")],
  },
];
