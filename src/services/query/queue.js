import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Get question by ID
export const useGetQuestion = (questionId) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const response = await api.get(`/api/questions/id/${questionId}`);
      return response.data;
    },
    enabled: !!questionId,
  });
};

// Get all questions - paginated
export const useGetAllQuestions = (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
) => {
  return useQuery({
    queryKey: ["questions", "all", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: async () => {
      const response = await api.get(
        `/api/questions/all?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      );
      return response.data;
    },
  });
};

// Get all questions by user - paginated
export const useGetUserQuestions = (
  userId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
) => {
  return useQuery({
    queryKey: [
      "questions",
      "user",
      userId,
      pageNo,
      pageSize,
      sortBy,
      ascOrDesc,
    ],
    queryFn: async () => {
      const response = await api.get(
        `/api/questions/all/user/${userId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      );
      return response.data;
    },
    enabled: !!userId,
  });
};

// Create new question
export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: (questionData) => {
      if (!questionData) {
        throw new Error("Question data is required");
      }
      return api.post("/api/questions/create", questionData);
    },
  });
};

// Update question
export const useUpdateQuestion = () => {
  return useMutation({
    mutationFn: (questionData) =>
      api.put("/api/questions/update", questionData),
  });
};

// Delete question
export const useDeleteQuestion = () => {
  return useMutation({
    mutationFn: (questionId) => {
      if (!questionId) {
        throw new Error("Question ID is required");
      }
      return api.delete(`/api/questions/id/${questionId}/delete`);
    },
  });
};