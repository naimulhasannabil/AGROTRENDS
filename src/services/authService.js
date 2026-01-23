import API from "./api";

export const signIn = async (data) => {
  return API.post("/api/auth/sign-in", data);
};

export const adminSignIn = async (data) => {
  console.log("Admin sign-in request payload:", data);
  try {
    const response = await API.post("/api/admin/sign-in", data);
    console.log("Admin sign-in response:", response);
    return response;
  } catch (error) {
    console.error("Admin sign-in error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    throw error;
  }
};

export const signUp = async (data) => {
  console.log("Sign-up request payload:", data);
  try {
    const response = await API.post("/api/auth/sign-up", data);
    console.log("Sign-up response:", response);
    return response;
  } catch (error) {
    console.error("Sign-up error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    throw error;
  }
};

export const signOut = async () => {
  return API.get("/api/auth/sign-out");
};

export const updateProfile = async (data) => {
  // /api/user/me is only for GET, use /api/user/update for updates
  return API.put("/api/user/update", data);
};

export const getUserProfile = async () => {
  try {
    const response = await API.get("/api/user/me");
    return response.data;
  } catch (error) {
    console.error("Get user profile error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await API.get(`/api/user/id/${userId}`);
    console.log("Get user by ID response:", response);
    return response;
  } catch (error) {
    console.error("Get user by ID error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
};
