import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Get all comments by blog id
export const useGetCommentsByBlogId = (blogId) => {
  return useQuery({
    queryKey: ["comments", "blog", blogId],
    queryFn: () =>
      api.get(`/api/comments/blog/${blogId}`).then((res) => res.data),
    enabled: !!blogId,
  });
};

// Get comment by id
export const useGetCommentById = (commentId) => {
  return useQuery({
    queryKey: ["comments", "id", commentId],
    queryFn: () =>
      api.get(`/api/comments/id/${commentId}`).then((res) => res.data),
    enabled: !!commentId,
  });
};

// Get all replies by parent comment id
export const useGetRepliesByParentId = (parentCommentId) => {
  return useQuery({
    queryKey: ["comments", "replies", parentCommentId],
    queryFn: () =>
      api
        .get(`/api/comments/replies/${parentCommentId}`)
        .then((res) => res.data),
    enabled: !!parentCommentId,
  });
};

// Add new comment
export const useCreateComment = () => {
  return useMutation({
    mutationFn: (data) =>
      api.post("/api/comments/create", data).then((res) => res.data),
  });
};

// Reply to a comment
export const useReplyToComment = () => {
  return useMutation({
    mutationFn: (data) =>
      api.post("/api/comments/reply", data).then((res) => res.data),
  });
};

// Update comment
export const useUpdateComment = () => {
  return useMutation({
    mutationFn: (data) =>
      api.put("/api/comments/update", data).then((res) => res.data),
  });
};

// Delete comment
export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId) =>
      api.delete(`/api/comments/id/${commentId}`).then((res) => res.data),
  });
};
