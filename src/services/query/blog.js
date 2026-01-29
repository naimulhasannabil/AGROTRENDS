import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Get blog by ID
export const useGetBlog = (blogId, options) => {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => api.get(`/api/blogs/id/${blogId}`),
    enabled: !!blogId,
    ...options,
  });
};

// Get all blogs (paginated)
export const useGetAllBlogs = (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  options,
) => {
  return useQuery({
    queryKey: ["blogs", "all", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: () =>
      api.get(
        `/api/blogs/all?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
    ...options,
  });
};

// Get blogs by category (paginated)
export const useGetBlogsByCategory = (
  categoryId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  options,
) => {
  return useQuery({
    queryKey: [
      "blogs",
      "category",
      categoryId,
      pageNo,
      pageSize,
      sortBy,
      ascOrDesc,
    ],
    queryFn: () =>
      api.get(
        `/api/blogs/all/category/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
    enabled: !!categoryId,
    ...options,
  });
};

// Get blogs by author (paginated)
export const useGetBlogsByAuthor = (
  authorId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  options,
) => {
  return useQuery({
    queryKey: [
      "blogs",
      "author",
      authorId,
      pageNo,
      pageSize,
      sortBy,
      ascOrDesc,
    ],
    queryFn: () =>
      api.get(
        `/api/blogs/all/author/${authorId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
    enabled: !!authorId,
    ...options,
  });
};

// Create new blog
export const useCreateBlog = (options) => {
  return useMutation({
    mutationFn: (data) => api.post("/api/blogs/create", data),
    ...options,
  });
};

// Update blog
export const useUpdateBlog = (options) => {
  return useMutation({
    mutationFn: (data) => api.put("/api/blogs/update", data),
    ...options,
  });
};

// Delete blog
export const useDeleteBlog = (options) => {
  return useMutation({
    mutationFn: (blogId) => api.delete(`/api/blogs/id/${blogId}/delete`),
    ...options,
  });
};

// Get all categories (paginated)
export const useGetCategories = (
  pageNo = 0,
  pageSize = 50,
  sortBy = "categoryName",
  ascOrDesc = "asc",
  options,
) => {
  return useQuery({
    queryKey: ["categories", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: () =>
      api.get(
        `/api/categories/all?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
    ...options,
  });
};


// Get comments by blog ID
export const useGetComments = (blogId, options) => {
  return useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => api.get(`/api/blogs/${blogId}/comments`),
    enabled: !!blogId,
    ...options,
  });
};

// Create comment
export const useCreateComment = (options) => {
  return useMutation({
    mutationFn: (data) => api.post("/api/comments/create", data),
    ...options,
  });
};

// Update comment
export const useUpdateComment = (options) => {
  return useMutation({
    mutationFn: (data) => api.put("/api/comments/update", data),
    ...options,
  });
};

// Delete comment
export const useDeleteComment = (options) => {
  return useMutation({
    mutationFn: (commentId) => api.delete(`/api/comments/${commentId}/delete`),
    ...options,
  });
};


// Create reply
export const useCreateReply = (options) => {
  return useMutation({
    mutationFn: (data) => api.post("/api/replies/create", data),
    ...options,
  });
};

// Update reply
export const useUpdateReply = (options) => {
  return useMutation({
    mutationFn: (data) => api.put("/api/replies/update", data),
    ...options,
  });
};

// Delete reply
export const useDeleteReply = (options) => {
  return useMutation({
    mutationFn: (replyId) => api.delete(`/api/replies/${replyId}/delete`),
    ...options,
  });
};