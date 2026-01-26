import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CommentEditor from '../components/CommentEditor'
import { useGetBlog, useDeleteBlog } from '../services/query/blog'
import { useQueryClient } from '@tanstack/react-query'
import { 
  getCommentsByBlogId, 
  addComment, 
  updateComment, 
  deleteComment, 
  addReply, 
  updateReply, 
  deleteReply 
} from '../services/blogService'

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  // Use React Query hooks
  const { data: blogData, isLoading, error: blogError } = useGetBlog(id)
  const deleteBlogMutation = useDeleteBlog({
    onSuccess: () => {
      setShowDeleteModal(false)
      // Invalidate all blog queries to refresh the list
      queryClient.invalidateQueries(['blogs'])
      queryClient.invalidateQueries(['blog'])
      alert('Blog deleted successfully!')
      navigate('/blogs')
    },
    onError: (err) => {
      console.error('Error deleting blog:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete blog. Please try again.'
      alert(errorMessage)
      setShowDeleteModal(false)
    }
  })
  
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null) // Format: { commentId, replyId } or { commentId }
  const [replyText, setReplyText] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [editingReply, setEditingReply] = useState(null)
  const [editReplyText, setEditReplyText] = useState('')
  const [newCommentsCount, setNewCommentsCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  
  // Normalize blog data with useMemo to prevent dependency issues
  const blog = useMemo(() => {
    if (!blogData?.data) return null;
    
    // Handle different API response structures
    const rawBlog = blogData.data?.payload || blogData.data?.data || blogData.data;
    
    if (!rawBlog) return null;
    
    return {
      ...rawBlog,
      blogId: rawBlog.id,
      authorName: rawBlog.author?.user?.name || rawBlog.authorName || 'Unknown Author',
      authorUserId: rawBlog.author?.user?.id || rawBlog.authorUserId,
      authorEmail: rawBlog.author?.user?.email,
      authorDesignation: rawBlog.author?.designation,
      authorOccupation: rawBlog.author?.occupation,
      authorWorkplace: rawBlog.author?.workPlaceOrInstitution,
      categoryName: rawBlog.category?.categoryName || rawBlog.categoryName,
      categoryId: rawBlog.category?.id || rawBlog.categoryId,
      createdDate: rawBlog.creationDate || rawBlog.createdDate || (rawBlog.creationDateTimeStamp ? new Date(rawBlog.creationDateTimeStamp).toISOString() : null),
      lastModifiedDate: rawBlog.lastModifiedDate || (rawBlog.lastModifiedDateTimeStamp ? new Date(rawBlog.lastModifiedDateTimeStamp).toISOString() : null)
    }
  }, [blogData])
  
  // Check if user is an author (userType array includes 'AUTHOR')
  const isAuthor = user?.userType?.includes('AUTHOR')
  // Check if current user is the blog author - handle both API structures
  const isBlogAuthor = blog && user && (
    blog.author?.user?.id === user.id || 
    blog.authorUserId === user.id || 
    blog.author?.id === user.id
  )

  const fetchComments = useCallback(async () => {
    try {
      const data = await getCommentsByBlogId(id)
      setComments(data)
    } catch (err) {
      console.error('Error fetching comments:', err)
      // Don't show error, just keep empty comments
    }
  }, [id])

  useEffect(() => {
    fetchComments()
  }, [id, fetchComments])
  
  // Poll for new comments to show notification (for authors)
  useEffect(() => {
    if (!blog || !user || !isBlogAuthor) return
    
    const interval = setInterval(async () => {
      try {
        const freshComments = await getCommentsByBlogId(id)
        if (freshComments.length > comments.length) {
          const newCount = freshComments.length - comments.length
          setNewCommentsCount(newCount)
          setShowNotification(true)
          // Auto-hide notification after 5 seconds
          setTimeout(() => setShowNotification(false), 5000)
        }
      } catch {
        // Silent fail for polling
      }
    }, 10000) // Check every 10 seconds
    
    return () => clearInterval(interval)
  }, [blog, user, comments.length, id, isBlogAuthor])
  
  // Handle comments from blog response
  useEffect(() => {
    if (blogData?.data?.comments && Array.isArray(blogData.data.comments)) {
      const normalizedComments = blogData.data.comments.map(comment => ({
        commentId: comment.id,
        content: comment.commentContent,
        userId: comment.user?.id,
        username: comment.user?.name,
        userEmail: comment.user?.email,
        createdDate: comment.creationDate,
        replies: comment.replies || [],
        parentCommentId: comment.parentComment
      }))
      setComments(normalizedComments)
    }
  }, [blogData])

  
  const handleDeleteBlog = async () => {
    try {
      deleteBlogMutation.mutate(id)
    } catch (err) {
      console.error('Error deleting blog:', err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to comment')
      return
    }
    
    if (newComment.trim()) {
      try {
        const commentData = {
          blogId: id,
          userId: user.id,
          content: newComment,
          username: user.username // Include username for display
        }
        const savedComment = await addComment(commentData)
        setComments([...comments, savedComment])
        setNewComment('')
      } catch (err) {
        console.error('Error adding comment:', err)
        alert('Failed to post comment. Please try again.')
      }
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.commentId)
    setEditCommentText(comment.content)
  }

  const handleUpdateComment = async (commentId) => {
    if (editCommentText.trim()) {
      try {
        const updateData = {
          commentId,
          content: editCommentText
        }
        await updateComment(updateData)
        
        setComments(comments.map(c => 
          c.commentId === commentId ? { ...c, content: editCommentText } : c
        ))
        setEditingComment(null)
        setEditCommentText('')
      } catch (err) {
        console.error('Error updating comment:', err)
        alert('Failed to update comment. Please try again.')
      }
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId)
        setComments(comments.filter(c => c.commentId !== commentId))
      } catch (err) {
        console.error('Error deleting comment:', err)
        alert('Failed to delete comment. Please try again.')
      }
    }
  }

  const handleReplySubmit = async (commentId) => {
    if (!user) {
      alert('Please sign in to reply')
      return
    }
    
    if (replyText.trim()) {
      try {
        const replyData = {
          commentId,
          userId: user.id,
          content: replyText,
          username: user.username // Include username for display
        }
        const savedReply = await addReply(replyData)
        
        const updatedComments = comments.map(comment => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), savedReply]
            }
          }
          return comment
        })
        setComments(updatedComments)
        setReplyText('')
        setReplyTo(null)
      } catch (err) {
        console.error('Error adding reply:', err)
        alert('Failed to post reply. Please try again.')
      }
    }
  }

  const handleEditReply = (reply) => {
    setEditingReply(reply.replyId)
    setEditReplyText(reply.content)
  }

  const handleUpdateReply = async (commentId, replyId) => {
    if (editReplyText.trim()) {
      try {
        const updateData = {
          replyId,
          content: editReplyText
        }
        await updateReply(updateData)
        
        setComments(comments.map(comment => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              replies: comment.replies.map(r => 
                r.replyId === replyId ? { ...r, content: editReplyText } : r
              )
            }
          }
          return comment
        }))
        setEditingReply(null)
        setEditReplyText('')
      } catch (err) {
        console.error('Error updating reply:', err)
        alert('Failed to update reply. Please try again.')
      }
    }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    if (confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteReply(replyId)
        
        setComments(comments.map(comment => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter(r => r.replyId !== replyId)
            }
          }
          return comment
        }))
      } catch (err) {
        console.error('Error deleting reply:', err)
        alert('Failed to delete reply. Please try again.')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  console.log('BlogDetail - Current user:', user)
  console.log('BlogDetail - userType:', user?.userType)
  console.log('BlogDetail - isAuthor:', isAuthor)
  console.log('BlogDetail - isBlogAuthor:', isBlogAuthor)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  // Check if user is logged in - require login to view blog details
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-primary-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Sign In Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to view full blog details and interact with the content.</p>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              to="/sign-in"
              state={{ from: `/blogs/${id}` }}
              className="btn-primary py-3 px-6 text-lg inline-block text-center"
            >
              Sign In
            </Link>
            <Link 
              to="/sign-up"
              state={{ from: `/blogs/${id}` }}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Don't have an account? Sign Up
            </Link>
            <Link 
              to="/blogs" 
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (blogError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">{blogError?.message || 'Blog not found'}</h3>
          </div>
          <Link to="/blogs" className="btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Notification */}
      {showNotification && isBlogAuthor && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <div>
              <p className="font-semibold">New Comment{newCommentsCount > 1 ? 's' : ''}!</p>
              <p className="text-sm">{newCommentsCount} new comment{newCommentsCount > 1 ? 's' : ''} on your blog</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4 hover:bg-white/20 rounded-full p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        {blog.imageUrl && (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Blog Content */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>

          {/* Blog Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            
            {/* Category Badge */}
            {blog.categoryName && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {blog.categoryName}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-gray-600">
                    By <span className="font-semibold">{blog.authorName}</span>
                  </p>
                  {blog.authorDesignation && blog.authorDesignation !== 'string' && (
                    <p className="text-sm text-gray-500">{blog.authorDesignation}</p>
                  )}
                  {blog.authorWorkplace && blog.authorWorkplace !== 'string' && (
                    <p className="text-sm text-gray-500">{blog.authorWorkplace}</p>
                  )}
                  <p className="text-sm text-gray-500">{formatDate(blog.createdDate)}</p>
                  {blog.lastModifiedDate && blog.lastModifiedDate !== blog.createdDate && (
                    <p className="text-xs text-gray-400">Updated: {formatDate(blog.lastModifiedDate)}</p>
                  )}
                </div>
              </div>
              
              {/* Author Actions */}
              {isBlogAuthor && (
                <div className="flex space-x-2">
                  <Link 
                    to={`/blogs/edit/${blog.blogId}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none">
              <div 
                className="text-lg leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            {user ? (
              <div className="mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <CommentEditor
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onSubmit={handleCommentSubmit}
                      placeholder="Share your thoughts..."
                      submitLabel="Post Comment"
                      rows={3}
                      size="medium"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-md text-center">
                <p className="text-gray-600">
                  <Link to="/sign-in" className="text-primary-600 hover:text-primary-800 font-medium">
                    Sign in
                  </Link> to join the conversation
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.commentId} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {comment.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Comment Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{comment.username}</h4>
                          <p className="text-sm text-gray-500">{formatDate(comment.createdDate)}</p>
                        </div>

                        {/* Comment Actions (Edit/Delete) - Only for comment owner */}
                        {user && comment.userId === user.id && (
                          <div className="flex space-x-2">
                            {editingComment !== comment.commentId && (
                              <>
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                  title="Edit comment"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.commentId)}
                                  className="text-sm text-red-600 hover:text-red-800"
                                  title="Delete comment"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comment Content (Editable) */}
                      {editingComment === comment.commentId ? (
                        <div className="mt-2">
                          <CommentEditor
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            onSubmit={() => handleUpdateComment(comment.commentId)}
                            onCancel={() => {
                              setEditingComment(null)
                              setEditCommentText('')
                            }}
                            placeholder="Edit your comment..."
                            submitLabel="Save"
                            showCancel={true}
                            autoFocus={true}
                            rows={3}
                            size="medium"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-3">{comment.content}</p>
                          
                          {/* Reply Button */}
                          {user && (
                            <button
                              onClick={() => setReplyTo({ commentId: comment.commentId })}
                              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                            >
                              Reply
                            </button>
                          )}
                        </>
                      )}

                      {/* Reply Form after main comment */}
                      {replyTo?.commentId === comment.commentId && !replyTo?.replyId && (
                        <div className="mt-3 ml-8">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-xs">
                                  {user.username?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <CommentEditor
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onSubmit={() => handleReplySubmit(comment.commentId)}
                                onCancel={() => {
                                  setReplyTo(null)
                                  setReplyText('')
                                }}
                                placeholder="Write your reply..."
                                submitLabel="Reply"
                                showCancel={true}
                                autoFocus={true}
                                rows={2}
                                size="small"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-8 mt-4 space-y-4">
                          {comment.replies.map(reply => (
                            <div key={reply.replyId} className="bg-gray-50 p-4 rounded-md">
                              <div className="flex items-start space-x-2">
                                {/* Reply Avatar */}
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold text-xs">
                                      {reply.username?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex-1">
                                  {/* Reply Header */}
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h5 className="font-semibold text-sm">{reply.username}</h5>
                                      <p className="text-xs text-gray-500">{formatDate(reply.createdDate)}</p>
                                    </div>

                                    {/* Reply Actions (Edit/Delete) - Only for reply owner */}
                                    {user && reply.userId === user.id && (
                                      <div className="flex space-x-2">
                                        {editingReply !== reply.replyId && (
                                          <>
                                            <button
                                              onClick={() => handleEditReply(reply)}
                                              className="text-sm text-blue-600 hover:text-blue-800"
                                              title="Edit reply"
                                            >
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}
                                              className="text-sm text-red-600 hover:text-red-800"
                                              title="Delete reply"
                                            >
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                              </svg>
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Reply Content (Editable) */}
                                  {editingReply === reply.replyId ? (
                                    <div>
                                      <CommentEditor
                                        value={editReplyText}
                                        onChange={(e) => setEditReplyText(e.target.value)}
                                        onSubmit={() => handleUpdateReply(comment.commentId, reply.replyId)}
                                        onCancel={() => {
                                          setEditingReply(null)
                                          setEditReplyText('')
                                        }}
                                        placeholder="Edit your reply..."
                                        submitLabel="Save"
                                        showCancel={true}
                                        autoFocus={true}
                                        rows={2}
                                        size="small"
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                                      
                                      {/* Reply Button for nested replies */}
                                      {user && (
                                        <button
                                          onClick={() => setReplyTo({ commentId: comment.commentId, replyId: reply.replyId })}
                                          className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                                        >
                                          Reply
                                        </button>
                                      )}
                                    </>
                                  )}

                                  {/* Reply Form under this specific reply */}
                                  {replyTo?.commentId === comment.commentId && replyTo?.replyId === reply.replyId && (
                                    <div className="mt-3">
                                      <div className="flex items-start space-x-2">
                                        <div className="flex-shrink-0">
                                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-xs">
                                              {user.username?.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex-1">
                                          <CommentEditor
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onSubmit={() => handleReplySubmit(comment.commentId)}
                                            onCancel={() => {
                                              setReplyTo(null)
                                              setReplyText('')
                                            }}
                                            placeholder="Write your reply..."
                                            submitLabel="Reply"
                                            showCancel={true}
                                            autoFocus={true}
                                            rows={2}
                                            size="small"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Blog</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteBlog}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail
