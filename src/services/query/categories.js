import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Delete category
export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (categoryId) =>
      api.delete(`/api/categories/id/${categoryId}/delete`),
  });
};

// Get all categories - paginated
export const useGetAllCategories = (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
) => {
  return useQuery({
    queryKey: ["categories", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: () =>
      api.get("/api/categories/all", {
        params: {
          pageNo,
          pageSize,
          sortBy,
          ascOrDesc,
        },
      }),
  });
};

// Create new category
export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (categoryName) =>
      api.post("/api/categories/create", null, {
        params: {
          categoryName,
        },
      }),
  });
};

// Update category
export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ categoryId, categoryData }) =>
      api.put(`/api/categories/update/categoryId/${categoryId}`, categoryData),
  });
};
