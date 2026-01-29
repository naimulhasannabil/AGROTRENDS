import api from "../api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Fetch answer by id
export const useGetAnswer = (answerId) => {
  return useQuery({
    queryKey: ["answer", answerId],
    queryFn: () =>
      api.get(`/api/answers/id/${answerId}`).then((res) => res.data),
    enabled: !!answerId,
  });
};

// Fetch all answers by question id
export const useGetAnswersByQuestion = (questionId) => {
  return useQuery({
    queryKey: ["answers", "question", questionId],
    queryFn: () =>
      api.get(`/api/answers/question/${questionId}`).then((res) => res.data),
    enabled: !!questionId,
  });
};

// Fetch all replies by parent answer id
export const useGetReplies = (parentAnswerId) => {
  return useQuery({
    queryKey: ["answers", "replies", parentAnswerId],
    queryFn: () =>
      api.get(`/api/answers/replies/${parentAnswerId}`).then((res) => res.data),
    enabled: !!parentAnswerId,
  });
};

// Create new answer
export const useCreateAnswer = () => {
  return useMutation({
    mutationFn: (data) =>
      api.post("/api/answers/create", data).then((res) => res.data),
  });
};

// Reply to an answer
export const useReplyToAnswer = () => {
  return useMutation({
    mutationFn: (data) =>
      api.post("/api/answers/reply", data).then((res) => res.data),
  });
};

// Update answer
export const useUpdateAnswer = () => {
  return useMutation({
    mutationFn: (data) =>
      api.put("/api/answers/update/", data).then((res) => res.data),
  });
};

// Delete answer
export const useDeleteAnswer = () => {
  return useMutation({
    mutationFn: (answerId) =>
      api.delete(`/api/answers/delete/id/${answerId}`).then((res) => res.data),
  });
};