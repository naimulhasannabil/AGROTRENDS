import API from "./api";

// Get all blogs with pagination
export const getAllBlogs = async (
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "desc",
) => {
  try {
    const response = await API.get("/api/blogs/all", {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get all blogs response:", response.data);

    // Normalize the response data
    if (Array.isArray(response.data)) {
      const normalizedBlogs = response.data.map((blog) => ({
        ...blog,
        blogId: blog.id,
        // Extract author info from nested structure
        authorName:
          blog.author?.user?.name || blog.authorName || "Unknown Author",
        authorUserId: blog.author?.user?.id || blog.authorUserId,
        authorEmail: blog.author?.user?.email,
        authorDesignation: blog.author?.designation,
        authorOccupation: blog.author?.occupation,
        authorWorkplace: blog.author?.workPlaceOrInstitution,
        // Extract category info
        categoryName: blog.category?.categoryName || blog.categoryName,
        categoryId: blog.category?.id || blog.categoryId,
        // Use creationDate from API
        createdDate: blog.creationDate || blog.createdDate,
        lastModifiedDate: blog.lastModifiedDate,
        // Comments count
        commentsCount: blog.comments?.length || 0,
      }));
      return normalizedBlogs;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Get blogs by category with pagination
export const getBlogsByCategory = async (
  categoryId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "desc",
) => {
  try {
    const response = await API.get(`/api/blogs/all/category/${categoryId}`, {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get blogs by category response:", response.data);

    // Normalize the response data
    if (Array.isArray(response.data)) {
      const normalizedBlogs = response.data.map((blog) => ({
        ...blog,
        blogId: blog.id,
        // Extract author info from nested structure
        authorName:
          blog.author?.user?.name || blog.authorName || "Unknown Author",
        authorUserId: blog.author?.user?.id || blog.authorUserId,
        authorEmail: blog.author?.user?.email,
        authorDesignation: blog.author?.designation,
        authorOccupation: blog.author?.occupation,
        authorWorkplace: blog.author?.workPlaceOrInstitution,
        // Extract category info
        categoryName: blog.category?.categoryName || blog.categoryName,
        categoryId: blog.category?.id || blog.categoryId,
        // Use creationDate from API
        createdDate: blog.creationDate || blog.createdDate,
        lastModifiedDate: blog.lastModifiedDate,
        // Comments count
        commentsCount: blog.comments?.length || 0,
      }));
      return normalizedBlogs;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    throw error;
  }
};

// Get blogs by author with pagination
export const getBlogsByAuthor = async (
  authorId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "desc",
) => {
  try {
    const response = await API.get(`/api/blogs/all/author/${authorId}`, {
      params: { pageNo, pageSize, sortBy, ascOrDesc },
    });
    console.log("Get blogs by author response:", response.data);

    // Normalize the response data
    if (Array.isArray(response.data)) {
      const normalizedBlogs = response.data.map((blog) => ({
        ...blog,
        blogId: blog.id,
        // Extract author info from nested structure
        authorName:
          blog.author?.user?.name || blog.authorName || "Unknown Author",
        authorUserId: blog.author?.user?.id || blog.authorUserId,
        authorEmail: blog.author?.user?.email,
        authorDesignation: blog.author?.designation,
        authorOccupation: blog.author?.occupation,
        authorWorkplace: blog.author?.workPlaceOrInstitution,
        // Extract category info
        categoryName: blog.category?.categoryName || blog.categoryName,
        categoryId: blog.category?.id || blog.categoryId,
        // Use creationDate from API
        createdDate: blog.creationDate || blog.createdDate,
        lastModifiedDate: blog.lastModifiedDate,
        // Comments count
        commentsCount: blog.comments?.length || 0,
      }));
      return normalizedBlogs;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by author:", error);
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (blogId) => {
  try {
    const response = await API.get(`/api/blogs/id/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

// Create new blog (Author only)
export const createBlog = async (blogData) => {
  try {
    console.log("Creating blog with data:", blogData);
    const response = await API.post("/api/blogs/create", blogData);
    console.log("Create blog response:", response.data);

    // Normalize the response data
    const blog = response.data;
    const normalizedBlog = {
      ...blog,
      blogId: blog.id,
      // Extract author info from nested structure
      authorName:
        blog.author?.user?.name || blog.authorName || "Unknown Author",
      authorUserId: blog.author?.user?.id || blog.authorUserId,
      authorEmail: blog.author?.user?.email,
      authorDesignation: blog.author?.designation,
      authorOccupation: blog.author?.occupation,
      authorWorkplace: blog.author?.workPlaceOrInstitution,
      // Extract category info
      categoryName: blog.category?.categoryName || blog.categoryName,
      categoryId: blog.category?.id || blog.categoryId,
      // Use creationDate from API
      createdDate: blog.creationDate || blog.createdDate,
      lastModifiedDate: blog.lastModifiedDate,
      // Comments count
      commentsCount: blog.comments?.length || 0,
    };

    return normalizedBlog;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Update blog (Author only)
export const updateBlog = async (blogData) => {
  try {
    console.log("Updating blog with data:", blogData);
    const response = await API.put("/api/blogs/update", blogData);
    console.log("Update blog response:", response.data);

    // Normalize the response data
    const blog = response.data;
    const normalizedBlog = {
      ...blog,
      blogId: blog.id,
      // Extract author info from nested structure
      authorName:
        blog.author?.user?.name || blog.authorName || "Unknown Author",
      authorUserId: blog.author?.user?.id || blog.authorUserId,
      authorEmail: blog.author?.user?.email,
      authorDesignation: blog.author?.designation,
      authorOccupation: blog.author?.occupation,
      authorWorkplace: blog.author?.workPlaceOrInstitution,
      // Extract category info
      categoryName: blog.category?.categoryName || blog.categoryName,
      categoryId: blog.category?.id || blog.categoryId,
      // Use creationDate from API
      createdDate: blog.creationDate || blog.createdDate,
      lastModifiedDate: blog.lastModifiedDate,
      // Comments count
      commentsCount: blog.comments?.length || 0,
    };

    return normalizedBlog;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete blog (Author only)
export const deleteBlog = async (blogId) => {
  try {
    const response = await API.delete(`/api/blogs/id/${blogId}/delete`);
    console.log("Delete blog response:", response.data);

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || "Blog deleted successfully",
      };
    } else {
      throw new Error(response.data?.message || "Failed to delete blog");
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// ============================================
// COMMENT API FUNCTIONS
// ============================================

// Get comment by ID
export const getCommentById = async (commentId) => {
  try {
    const response = await API.get(`/api/comments/id/${commentId}`);
    console.log("Get comment by ID response:", response.data);

    // Normalize the response data
    const comment = response.data;
    const normalizedComment = {
      ...comment,
      commentId: comment.id,
      content: comment.commentContent,
      // Extract user info from nested structure
      userId: comment.user?.id,
      username: comment.user?.name,
      userEmail: comment.user?.email,
      userTypes: comment.user?.userTypes || [],
      // Dates
      createdDate: comment.creationDate,
      lastModifiedDate: comment.lastModifiedDate,
      // Parent and replies
      parentCommentId: comment.parentComment,
      replies: comment.replies || [],
    };

    return normalizedComment;
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    throw error;
  }
};

// Get all comments for a blog
export const getCommentsByBlogId = async (blogId) => {
  try {
    const response = await API.get(`/api/comments/blog/${blogId}`);
    console.log("Get comments by blog ID response:", response.data);

    // Normalize the response data
    if (Array.isArray(response.data)) {
      const normalizedComments = response.data.map((comment) => ({
        ...comment,
        commentId: comment.id,
        content: comment.commentContent,
        // Extract user info from nested structure
        userId: comment.user?.id,
        username: comment.user?.name,
        userEmail: comment.user?.email,
        userTypes: comment.user?.userTypes || [],
        // Dates
        createdDate: comment.creationDate,
        lastModifiedDate: comment.lastModifiedDate,
        // Parent and replies
        parentCommentId: comment.parentComment,
        replies: comment.replies || [],
      }));
      return normalizedComments;
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching comments by blog ID:", error);
    // Return empty array on error instead of throwing
    return [];
  }
};

// Get all replies for a parent comment
export const getRepliesByParentCommentId = async (parentCommentId) => {
  try {
    const response = await API.get(`/api/comments/replies/${parentCommentId}`);
    console.log("Get replies by parent comment response:", response.data);

    // Normalize the response data
    if (Array.isArray(response.data)) {
      const normalizedReplies = response.data.map((reply) => ({
        ...reply,
        replyId: reply.id,
        commentId: reply.id,
        content: reply.commentContent,
        // Extract user info from nested structure
        userId: reply.user?.id,
        username: reply.user?.name,
        userEmail: reply.user?.email,
        userTypes: reply.user?.userTypes || [],
        // Dates
        createdDate: reply.creationDate,
        lastModifiedDate: reply.lastModifiedDate,
        // Parent and nested replies
        parentCommentId: reply.parentComment,
        replies: reply.replies || [],
      }));
      return normalizedReplies;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching replies by parent comment:", error);
    throw error;
  }
};

// Add a new comment
export const addComment = async (commentData) => {
  try {
    // Expected commentData structure from frontend:
    // {
    //   blogId: number,
    //   userId: number,
    //   content: string,
    //   parentCommentId: number (optional)
    // }

    const { blogId, userId, content, parentCommentId } = commentData;

    // Prepare request body matching API schema
    const requestBody = {
      commentContent: content,
      userId: userId,
      blogId: blogId,
      parentCommentId: parentCommentId || null,
      replies: [],
    };

    console.log("Adding comment with data:", requestBody);
    const response = await API.post(
      `/api/comments/blog/${blogId}/user/${userId}`,
      requestBody,
    );
    console.log("Add comment response:", response.data);

    // Normalize the response data
    const comment = response.data;
    const normalizedComment = {
      ...comment,
      commentId: comment.id,
      content: comment.commentContent,
      // Extract user info from nested structure
      userId: comment.user?.id,
      username: comment.user?.name,
      userEmail: comment.user?.email,
      userTypes: comment.user?.userTypes || [],
      // Dates
      createdDate: comment.creationDate,
      lastModifiedDate: comment.lastModifiedDate,
      // Parent and replies
      parentCommentId: comment.parentComment,
      replies: comment.replies || [],
    };

    return normalizedComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentData) => {
  try {
    // Expected commentData structure from frontend:
    // {
    //   commentId: number,
    //   content: string,
    //   userId: number,
    //   blogId: number,
    //   parentCommentId: number (optional)
    // }

    const { commentId, content, userId, blogId, parentCommentId } = commentData;

    // Prepare request body matching API schema
    const requestBody = {
      commentId: commentId,
      commentContent: content,
      userId: userId,
      blogId: blogId,
      parentCommentId: parentCommentId || null,
      replies: [],
    };

    console.log("Updating comment with data:", requestBody);
    const response = await API.put(
      `/api/comments/id/${commentId}`,
      requestBody,
    );
    console.log("Update comment response:", response.data);

    // Normalize the response data
    const comment = response.data;
    const normalizedComment = {
      ...comment,
      commentId: comment.id,
      content: comment.commentContent,
      // Extract user info from nested structure
      userId: comment.user?.id,
      username: comment.user?.name,
      userEmail: comment.user?.email,
      userTypes: comment.user?.userTypes || [],
      // Dates
      createdDate: comment.creationDate,
      lastModifiedDate: comment.lastModifiedDate,
      // Parent and replies
      parentCommentId: comment.parentComment,
      replies: comment.replies || [],
    };

    return normalizedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`/api/comments/id/${commentId}`);
    console.log("Delete comment response:", response.data);

    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || "Comment deleted successfully",
      };
    } else {
      throw new Error(response.data?.message || "Failed to delete comment");
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Add a reply to a comment
export const addReply = async (replyData) => {
  try {
    // Expected replyData structure from frontend:
    // {
    //   blogId: number,
    //   userId: number,
    //   commentId: number (parent comment ID),
    //   content: string
    // }

    const { blogId, userId, commentId, content } = replyData;

    // Prepare request body matching API schema
    const requestBody = {
      commentContent: content,
      userId: userId,
      blogId: blogId,
      parentCommentId: commentId, // The parent comment we're replying to
      replies: [],
    };

    console.log("Adding reply with data:", requestBody);
    const response = await API.post(
      `/api/comments/blog/${blogId}/user/${userId}/reply/${commentId}`,
      requestBody,
    );
    console.log("Add reply response:", response.data);

    // Normalize the response data
    const reply = response.data;
    const normalizedReply = {
      ...reply,
      replyId: reply.id,
      commentId: reply.id,
      content: reply.commentContent,
      // Extract user info from nested structure
      userId: reply.user?.id,
      username: reply.user?.name,
      userEmail: reply.user?.email,
      userTypes: reply.user?.userTypes || [],
      // Dates
      createdDate: reply.creationDate,
      lastModifiedDate: reply.lastModifiedDate,
      // Parent and nested replies
      parentCommentId: reply.parentComment,
      replies: reply.replies || [],
    };

    return normalizedReply;
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};

// Update a reply
export const updateReply = async (replyData) => {
  try {
    // TODO: Replace with actual API call
    // Expected replyData structure:
    // {
    //   replyId: number,
    //   content: string
    // }
    // const response = await API.put("/api/comments/reply/update", replyData);
    // return response.data;

    // Mock response
    return { ...replyData, updatedDate: new Date().toISOString() };
  } catch (error) {
    console.error("Error updating reply:", error);
    throw error;
  }
};

// Delete a reply
export const deleteReply = async (replyId) => {
  // TODO: Replace with actual API call
  // try {
  //   const response = await API.delete(`/api/comments/reply/${replyId}/delete`);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error deleting reply:", error);
  //   throw error;
  // }

  // Mock response
  return { success: true, message: "Reply deleted" };
};
