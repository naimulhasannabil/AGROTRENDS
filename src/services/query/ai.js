import api from "../api";
import { useMutation } from "@tanstack/react-query";

// API function to call the AI endpoint
const askAI = async ({ question, lang = "en" }) => {
  const response = await api.post("/api/ai/ask", 
    { question }, // Send question in request body
    {
      params: {
        lang // Send lang as query parameter
      }
    }
  );
  return response.data;
};

// Custom hook using useMutation for POST requests
export const useAskAI = () => {
  return useMutation({
    mutationFn: askAI,
    onError: (error) => {
      console.error("Error asking AI:", error);
    }
  });
};