import API from "./api";

// Get all categories with pagination
export const getAllCategories = async (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
) => {
  try {
    const response = await API.get("/api/categories/all", {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get all categories response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
