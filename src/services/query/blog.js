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
