import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";
// Get question by ID
export const useGetQuestion = (questionId) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => api.get(`/api/questions/id/${questionId}`),
    enabled: !!questionId,
  });
};

// Get all questions - paginated
export const useGetAllQuestions = (
  pageNo = 0,
  pageSize = 20,
  sortBy = "createdDate",
  ascOrDesc = "asc",
) => {
  return useQuery({
    queryKey: ["questions", "all", pageNo, pageSize, sortBy, ascOrDesc],
    queryFn: () =>
      api.get(
        `/api/questions/all?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
  });
};

// Get all questions by user - paginated
export const useGetUserQuestions = (
  userId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "createdDate",
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
    queryFn: () =>
      api.get(
        `/api/questions/all/user/${userId}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&ascOrDesc=${ascOrDesc}`,
      ),
    enabled: !!userId,
  });
};

// Create new question
export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: (questionData) =>
      api.post("/api/questions/create", questionData),
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
    mutationFn: (questionId) =>
      api.delete(`/api/questions/id/${questionId}/delete`),
  });
};
