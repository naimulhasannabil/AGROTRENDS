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
export const useGetAllBlogs = (page = 1, limit = 10, options) => {
  return useQuery({
    queryKey: ["blogs", "all", page, limit],
    queryFn: () => api.get(`/api/blogs/all?page=${page}&limit=${limit}`),
    ...options,
  });
};

// Get blogs by category (paginated)
export const useGetBlogsByCategory = (
  categoryId,
  page = 1,
  limit = 10,
  options,
) => {
  return useQuery({
    queryKey: ["blogs", "category", categoryId, page, limit],
    queryFn: () =>
      api.get(
        `/api/blogs/all/category/${categoryId}?page=${page}&limit=${limit}`,
      ),
    enabled: !!categoryId,
    ...options,
  });
};

// Get blogs by author (paginated)
export const useGetBlogsByAuthor = (
  authorId,
  page = 1,
  limit = 10,
  options,
) => {
  return useQuery({
    queryKey: ["blogs", "author", authorId, page, limit],
    queryFn: () =>
      api.get(`/api/blogs/all/author/${authorId}?page=${page}&limit=${limit}`),
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
