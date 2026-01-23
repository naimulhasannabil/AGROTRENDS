import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../api";
import { useAuth } from "../../contexts/AuthContext";

export const useMe = () => {
  const { logout } = useAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/user/me");
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
export const useUserById = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/user/id/${userId}`);
      return data.payload;
    },
    enabled: !!userId,
  });
};
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.put("/api/user/update", userData);
      console.log(response.data);
      return response.data;
    },
  });
};
