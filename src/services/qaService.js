import API from "./api";

// Get all questions with pagination
export const getAllQuestions = async (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
) => {
  try {
    const response = await API.get("/api/questions/all", {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get all questions response:", response.data);

    // Handle wrapped response {status, message, payload: {content: [...]}}
    const data = response.data?.payload || response.data;
    const questionsArray = Array.isArray(data) ? data : data?.content || [];

    // Normalize the response data
    const normalizedQuestions = questionsArray.map((question) => ({
      ...question,
      questionId: question.id,
      // Extract user info from nested structure
      userId: question.user?.id,
      username: question.user?.name,
      userEmail: question.user?.email,
      userTypes: question.user?.userTypes || [],
      // Dates
      createdDate: question.creationDate,
      lastModifiedDate: question.lastModifiedDate,
      // Answers with normalized user data
      answers:
        question.answers?.map((answer) => ({
          ...answer,
          answerId: answer.id,
          answerContent: answer.content,
          // Extract answer user info
          userId: answer.user?.id,
          username: answer.user?.name,
          userEmail: answer.user?.email,
          createdDate: answer.creationDate,
          lastModifiedDate: answer.lastModifiedDate,
          // Parent and replies
          parentAnswerId: answer.parentAnswer,
          replies: answer.replies || [],
        })) || [],
      answersCount: question.answers?.length || 0,
    }));

    return normalizedQuestions;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    // Return empty array on error
    return [];
  }
};

// Get all questions by user with pagination
export const getQuestionsByUserId = async (
  userId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "desc",
) => {
  try {
    const response = await API.get(`/api/questions/all/user/${userId}`, {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get questions by user response:", response.data);

    // Handle wrapped response {status, message, payload: {content: [...]}}
    const data = response.data?.payload || response.data;
    const questionsArray = Array.isArray(data) ? data : data?.content || [];

    // Normalize the response data
    const normalizedQuestions = questionsArray.map((question) => ({
      ...question,
      questionId: question.id,
      // Extract user info from nested structure
      userId: question.user?.id,
      username: question.user?.name,
      userEmail: question.user?.email,
      userTypes: question.user?.userTypes || [],
      // Dates
      createdDate: question.creationDate,
      lastModifiedDate: question.lastModifiedDate,
      // Answers with normalized user data
      answers:
        question.answers?.map((answer) => ({
          ...answer,
          answerId: answer.id,
          answerContent: answer.content,
          // Extract answer user info
          userId: answer.user?.id,
          username: answer.user?.name,
          userEmail: answer.user?.email,
          createdDate: answer.creationDate,
          lastModifiedDate: answer.lastModifiedDate,
          // Parent and replies
          parentAnswerId: answer.parentAnswer,
          replies: answer.replies || [],
        })) || [],
      answersCount: question.answers?.length || 0,
    }));

    return normalizedQuestions;
  } catch (error) {
    console.error("Error fetching questions by user:", error);
    // Return empty array on error
    return [];
  }
};

// Get question by ID
export const getQuestionById = async (questionId) => {
  try {
    const response = await API.get(`/api/questions/id/${questionId}`);
    console.log("Get question by ID response:", response.data);

    // Normalize the response data
    if (response.data) {
      const question = response.data;
      return {
        ...question,
        questionId: question.id,
        // Extract user info from nested structure
        userId: question.user?.id,
        username: question.user?.name,
        userEmail: question.user?.email,
        userTypes: question.user?.userTypes || [],
        // Dates
        createdDate: question.creationDate,
        lastModifiedDate: question.lastModifiedDate,
        // Answers with normalized user data
        answers:
          question.answers?.map((answer) => ({
            ...answer,
            answerId: answer.id,
            answerContent: answer.content,
            // Extract answer user info
            userId: answer.user?.id,
            username: answer.user?.name,
            userEmail: answer.user?.email,
            createdDate: answer.creationDate,
            lastModifiedDate: answer.lastModifiedDate,
            // Parent and replies
            parentAnswerId: answer.parentAnswer,
            replies: answer.replies || [],
          })) || [],
        answersCount: question.answers?.length || 0,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    const response = await API.post("/api/questions/create", questionData);
    console.log("Create question response:", response.data);

    // Handle wrapped response {status, message, payload}
    const question = response.data?.payload || response.data;

    // Normalize the response data
    if (question) {
      return {
        ...question,
        questionId: question.id,
        // Extract user info from nested structure
        userId: question.user?.id,
        username: question.user?.name,
        userEmail: question.user?.email,
        userTypes: question.user?.userTypes || [],
        // Dates - use current date if null
        createdDate: question.creationDate || new Date().toISOString(),
        lastModifiedDate: question.lastModifiedDate,
        // Answers with normalized user data
        answers:
          question.answers?.map((answer) => ({
            ...answer,
            answerId: answer.id,
            answerContent: answer.content,
            // Extract answer user info
            userId: answer.user?.id,
            username: answer.user?.name,
            userEmail: answer.user?.email,
            createdDate: answer.creationDate,
            lastModifiedDate: answer.lastModifiedDate,
            // Parent and replies
            parentAnswerId: answer.parentAnswer,
            replies: answer.replies || [],
          })) || [],
        answersCount: question.answers?.length || 0,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

// Update an existing question
export const updateQuestion = async (questionData) => {
  try {
    const response = await API.put("/api/questions/update", questionData);
    console.log("Update question response:", response.data);

    // Normalize the response data
    if (response.data) {
      const question = response.data;
      return {
        ...question,
        questionId: question.id,
        // Extract user info from nested structure
        userId: question.user?.id,
        username: question.user?.name,
        userEmail: question.user?.email,
        userTypes: question.user?.userTypes || [],
        // Dates
        createdDate: question.creationDate,
        lastModifiedDate: question.lastModifiedDate,
        // Answers with normalized user data
        answers:
          question.answers?.map((answer) => ({
            ...answer,
            answerId: answer.id,
            answerContent: answer.content,
            // Extract answer user info
            userId: answer.user?.id,
            username: answer.user?.name,
            userEmail: answer.user?.email,
            createdDate: answer.creationDate,
            lastModifiedDate: answer.lastModifiedDate,
            // Parent and replies
            parentAnswerId: answer.parentAnswer,
            replies: answer.replies || [],
          })) || [],
        answersCount: question.answers?.length || 0,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete a question by ID
export const deleteQuestion = async (questionId) => {
  try {
    const response = await API.delete(`/api/questions/id/${questionId}/delete`);
    console.log("Delete question response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// Get answer by ID
export const getAnswerById = async (answerId) => {
  try {
    const response = await API.get(`/api/answers/id/${answerId}`);
    console.log("Get answer by ID response:", response.data);

    // Normalize the response data
    if (response.data) {
      const answer = response.data;
      return {
        ...answer,
        answerId: answer.id,
        answerContent: answer.content,
        // Extract user info from nested structure
        userId: answer.user?.id,
        username: answer.user?.name,
        userEmail: answer.user?.email,
        userTypes: answer.user?.userTypes || [],
        // Dates
        createdDate: answer.creationDate,
        lastModifiedDate: answer.lastModifiedDate,
        // Parent and replies
        parentAnswerId: answer.parentAnswer,
        replies: answer.replies || [],
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching answer by ID:", error);
    throw error;
  }
};

// Add a new answer to a question
export const addAnswer = async (questionId, userId, content) => {
  try {
    const response = await API.post(
      `/api/answers/question/${questionId}/user/${userId}`,
      null,
      {
        params: { content },
      },
    );
    console.log("Add answer response:", response.data);

    // Normalize the response data
    if (response.data) {
      const answer = response.data;
      return {
        ...answer,
        answerId: answer.id,
        answerContent: answer.content,
        // Extract user info from nested structure
        userId: answer.user?.id,
        username: answer.user?.name,
        userEmail: answer.user?.email,
        userTypes: answer.user?.userTypes || [],
        // Dates
        createdDate: answer.creationDate,
        lastModifiedDate: answer.lastModifiedDate,
        // Parent and replies
        parentAnswerId: answer.parentAnswer,
        replies: answer.replies || [],
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error adding answer:", error);
    throw error;
  }
};

// Reply to an answer (nested reply)
export const replyToAnswer = async (
  questionId,
  userId,
  parentAnswerId,
  content,
) => {
  try {
    const response = await API.post(
      `/api/answers/question/${questionId}/user/${userId}/reply/${parentAnswerId}`,
      null,
      {
        params: { content },
      },
    );
    console.log("Reply to answer response:", response.data);

    // Normalize the response data
    if (response.data) {
      const answer = response.data;
      return {
        ...answer,
        answerId: answer.id,
        answerContent: answer.content,
        // Extract user info from nested structure
        userId: answer.user?.id,
        username: answer.user?.name,
        userEmail: answer.user?.email,
        userTypes: answer.user?.userTypes || [],
        // Dates
        createdDate: answer.creationDate,
        lastModifiedDate: answer.lastModifiedDate,
        // Parent and replies
        parentAnswerId: answer.parentAnswer,
        replies: answer.replies || [],
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error replying to answer:", error);
    throw error;
  }
};

// Update an existing answer
export const updateAnswer = async (answerId, content) => {
  try {
    const response = await API.put(`/api/answers/id/${answerId}`, null, {
      params: { content },
    });
    console.log("Update answer response:", response.data);

    // Normalize the response data
    if (response.data) {
      const answer = response.data;
      return {
        ...answer,
        answerId: answer.id,
        answerContent: answer.content,
        // Extract user info from nested structure
        userId: answer.user?.id,
        username: answer.user?.name,
        userEmail: answer.user?.email,
        userTypes: answer.user?.userTypes || [],
        // Dates
        createdDate: answer.creationDate,
        lastModifiedDate: answer.lastModifiedDate,
        // Parent and replies
        parentAnswerId: answer.parentAnswer,
        replies: answer.replies || [],
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error updating answer:", error);
    throw error;
  }
};

// Delete an answer by ID
export const deleteAnswer = async (answerId) => {
  try {
    const response = await API.delete(`/api/answers/id/${answerId}`);
    console.log("Delete answer response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
};

// Get all replies by parent answer ID
export const getRepliesByParentAnswerId = async (parentAnswerId) => {
  try {
    const response = await API.get(`/api/answers/replies/${parentAnswerId}`);
    console.log("Get replies by parent answer response:", response.data);

    // Handle both array and paginated response
    const repliesArray = Array.isArray(response.data)
      ? response.data
      : response.data?.content || [];

    // Normalize the response data
    if (repliesArray.length > 0) {
      const normalizedReplies = repliesArray.map((answer) => ({
        ...answer,
        answerId: answer.id,
        answerContent: answer.content,
        // Extract user info from nested structure
        userId: answer.user?.id,
        username: answer.user?.name,
        userEmail: answer.user?.email,
        userTypes: answer.user?.userTypes || [],
        // Dates
        createdDate: answer.creationDate,
        lastModifiedDate: answer.lastModifiedDate,
        // Parent and replies
        parentAnswerId: answer.parentAnswer,
        replies: answer.replies || [],
      }));
      return normalizedReplies;
    }

    return [];
  } catch (error) {
    console.error("Error fetching replies by parent answer:", error);
    return [];
  }
};

// Get all answers by question ID
export const getAnswersByQuestionId = async (questionId) => {
  try {
    const response = await API.get(`/api/answers/question/${questionId}`);
    console.log("Get answers by question response:", response.data);

    // Handle wrapped response {status, message, payload: {content: [...]}}}
    const data = response.data?.payload || response.data;
    const answersArray = Array.isArray(data) ? data : data?.content || [];

    // Normalize the response data
    const normalizedAnswers = answersArray.map((answer) => ({
      ...answer,
      answerId: answer.id,
      answerContent: answer.content,
      // Extract user info from nested structure
      userId: answer.user?.id,
      username: answer.user?.name,
      userEmail: answer.user?.email,
      userTypes: answer.user?.userTypes || [],
      // Dates
      createdDate: answer.creationDate,
      lastModifiedDate: answer.lastModifiedDate,
      // Parent and replies
      parentAnswerId: answer.parentAnswer,
      replies: answer.replies || [],
    }));

    return normalizedAnswers;
  } catch (error) {
    console.error("Error fetching answers by question:", error);
    return [];
  }
};
