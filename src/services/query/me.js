import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";
import { useAuth } from "../../contexts/AuthContext";

export const useMe = () => {
  const { logout } = useAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/user/me", {
          params: { lang: "en" },
        });
        return response.data.payload;
      } catch (error) {
        if (error.response?.status === 403) {
          await logout();
        }
        throw error;
      }
    },
  });
};

export const useUserByEmail = (email) => {
  return useQuery({
    queryKey: ["user", "email", email],
    queryFn: async () => {
      const { data } = await api.get("/api/user/get", {
        params: { email, lang: "en" },
      });
      return data.payload;
    },
    enabled: !!email,
  });
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ["user", "id", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/user/id/${userId}`, {
        params: { lang: "en" },
      });
      return data.payload;
    },
    enabled: !!userId,
  });
};
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.put("/api/user/update", userData, {
        params: { lang: "en" },
      });
      console.log(response.data);
      return response.data;
    },
  });
};
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/api/user/delete", {
        params: { lang: "en" },
      });
      return response.data;
    },
  });
};

export const usePaginatedUsers = (
  pageNo = 0,
  pageSize = 20,
  sortBy = "createdDate",
  ascOrDesc = "asc",
) => {
  return useQuery({
    queryKey: ["users", "paginated", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: async () => {
      const { data } = await api.get("/api/user/paginated", {
        params: { pageNo, pageSize, sortBy, ascOrDesc },
      });
      return data.payload;
    },
  });
};
