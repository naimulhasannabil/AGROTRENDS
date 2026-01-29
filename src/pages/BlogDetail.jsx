import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CommentEditor from '../components/CommentEditor'
import { formatDate, formatDateTime } from '../utils/dateUtils'
import { 
  useGetBlog, 
  useDeleteBlog,
 
 } from '../services/query/blog'
import {
  useGetCommentsByBlogId,
  useCreateComment as useCreateCommentApi,
  useReplyToComment,
  useUpdateComment as useUpdateCommentApi,
  useDeleteComment as useDeleteCommentApi
} from '../services/query/comment'
import { useGetRepliesByParentId } from '../services/query/comment'
import { useUserByEmail, useUserById } from '../services/query'
import { useQueryClient } from '@tanstack/react-query'

function BlogDetail() {
  const { id } = useParams()
  // const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  // State management
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  // map of reply editor text by key: 'c-<commentId>' for top-level, 'r-<replyId>' for nested
  const [replyTexts, setReplyTexts] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [editingReply, setEditingReply] = useState(null)
  const [editReplyText, setEditReplyText] = useState('')
  const [newCommentsCount, setNewCommentsCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  
  // Fetch blog data using React Query
  const { data: blogData, isLoading, error: blogError } = useGetBlog(id)
  
  // Fetch comments using React Query
  // use comment API hook; enable only when id and user exist
  const { data: commentsData } = useGetCommentsByBlogId(user && id ? id : null)
  
  // Extract comments from response
  const comments = useMemo(() => {
    if (!commentsData) return []

    const rawComments = commentsData.payload || commentsData.data || commentsData
    
    if (Array.isArray(rawComments)) {
      // Normalize each item first; prefer username and derive from email local-part if needed
      const normalized = rawComments.map(item => {
        const createdByVal = item.createdBy || item.created_by || item.username || item.user?.name || item.userEmail || item.user?.email

        // Prefer explicit display/full name fields from API, then name, then username, then derive from email
        const possibleDisplay = item.displayName || item.fullName || item.full_name || item.name || item.user?.name || item.user?.displayName || item.user?.fullName || item.user?.firstName && item.user?.lastName ? `${item.user.firstName} ${item.user.lastName}` : null

        let displayName = possibleDisplay
        if (!displayName && createdByVal && typeof createdByVal === 'string' && !createdByVal.includes('@')) {
          displayName = createdByVal
        }

        let handle = item.username || item.user?.username || item.user?.userName || item.userName
        if (!handle && createdByVal && typeof createdByVal === 'string' && createdByVal.includes('@')) {
          handle = createdByVal.split('@')[0]
        }

        return {
          commentId: item.commentId || item.id,
          content: item.content || item.commentContent || item.replyContent,
          userId: item.userId || item.user?.id,
          username: handle,
          displayName: displayName,
          userEmail: item.userEmail || item.user?.email,
          createdBy: createdByVal,
          createdDate: item.createdDate || item.creationDate,
          parentCommentId: item.parentCommentId || item.parentComment || item.parentCommentId || null,
          // keep raw flag to distinguish replies coming as separate items
          isReply: !!(item.parentCommentId || item.parentComment)
        }
      })

      // Build map of parent comments
      const parents = []
      const parentMap = new Map()

      normalized.forEach(item => {
        if (!item.isReply) {
          const node = { ...item, replies: [] }
          parents.push(node)
          parentMap.set(String(item.commentId), node)
        }
      })

      // Attach replies to their parent; if parent not found, treat as top-level
      normalized.forEach(item => {
        if (item.isReply) {
          const pid = String(item.parentCommentId || item.commentId)
          const parent = parentMap.get(pid)
          const replyNode = {
            replyId: item.commentId,
            content: item.content,
            userId: item.userId,
            username: item.username,
            displayName: item.displayName,
            userEmail: item.userEmail,
            createdBy: item.createdBy,
            createdDate: item.createdDate
          }
          if (parent) {
            parent.replies.push(replyNode)
          } else {
            // no parent found, push as top-level comment with this reply info
            const orphan = { ...item, replies: [replyNode] }
            parents.push(orphan)
            parentMap.set(String(item.commentId), orphan)
          }
        }
      })

      return parents
    }
    
    return []
  }, [commentsData])
  
  // Normalize blog data
  const blog = useMemo(() => {
    if (!blogData?.data) return null
    
    const rawBlog = blogData.data?.payload || blogData.data?.data || blogData.data
    
    if (!rawBlog) return null
    
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
      // FIX: Proper date handling from timestamp
      createdDate: rawBlog.creationDate || rawBlog.createdDate || 
                   (rawBlog.creationDateTimeStamp ? new Date(rawBlog.creationDateTimeStamp).toISOString() : null),
      lastModifiedDate: rawBlog.lastModifiedDate || 
                       (rawBlog.lastModifiedDateTimeStamp ? new Date(rawBlog.lastModifiedDateTimeStamp).toISOString() : null)
    }
  }, [blogData])
  
  // Delete blog mutation
  const deleteBlogMutation = useDeleteBlog({
    onSuccess: () => {
      setShowDeleteModal(false)
      queryClient.invalidateQueries(['blogs'])
      queryClient.invalidateQueries(['blog'])
    },
    onError: (err) => {
      console.error('Error deleting blog:', err)
      alert('Failed to delete blog. Please try again.')
    }
  })

  // reuse update/delete comment APIs for replies as backend commonly shares endpoints
  const updateReplyMutation = useUpdateCommentApi({
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', 'blog', id])
      setEditingReply(null)
      setEditReplyText('')
    },
    onError: (err) => {
      console.error('Error updating reply:', err)
      alert('Failed to update reply. Please try again.')
    }
  })
  
  const deleteReplyMutation = useDeleteCommentApi({
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', 'blog', id])
    },
    onError: (err) => {
      console.error('Error deleting reply:', err)
      alert('Failed to delete reply. Please try again.')
    }
  })

  // Comment mutations (create/update/delete)
  const createCommentMutation = useCreateCommentApi({
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', 'blog', id])
      setNewComment('')
    },
    onError: (err) => {
      console.error('Error adding comment:', err)
      alert('Failed to post comment. Please try again.')
    }
  })

  const updateCommentMutation = useUpdateCommentApi({
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', 'blog', id])
      setEditingComment(null)
      setEditCommentText('')
    },
    onError: (err) => {
      console.error('Error updating comment:', err)
      alert('Failed to update comment. Please try again.')
    }
  })

  const deleteCommentMutation = useDeleteCommentApi({
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', 'blog', id])
    },
    onError: (err) => {
      console.error('Error deleting comment:', err)
      alert('Failed to delete comment. Please try again.')
    }
  })

  // Create reply mutation
  const createReplyMutation = useReplyToComment()
  
  // Component to resolve and render an author's display name
  const AuthorName = ({ displayName, username, userEmail, createdBy, userId }) => {
    // prefer explicit email if provided in userEmail or createdBy
    const email = userEmail || (createdBy && createdBy.includes('@') ? createdBy : null)
    const { data: remoteByEmail } = useUserByEmail(email)
    const { data: remoteById } = useUserById(userId)
    const resolved = displayName || remoteByEmail?.name || remoteById?.name || username || (email ? email.split('@')[0] : (createdBy && !createdBy.includes('@') ? createdBy : 'Unknown'))
    return <>{resolved}</>
  }

  // Replies component: fetch replies for a parent and render them (falls back to any initialReplies)
  const Replies = ({ parentId, initialReplies = [] }) => {
    const { data: repliesData, isLoading } = useGetRepliesByParentId(parentId)

    const fetched = useMemo(() => {
      if (!repliesData) return []
      const raw = repliesData.payload || repliesData.data || repliesData
      if (Array.isArray(raw)) {
        // map raw replies to normalized nodes and include parentReplyId if provided by API
        const mapped = raw.map(r => {
          const createdByVal = r.createdBy || r.created_by || r.username || r.user?.name || r.userEmail || r.user?.email

          const possibleDisplay = r.displayName || r.fullName || r.full_name || r.name || r.user?.name || r.user?.displayName || r.user?.fullName || (r.user?.firstName && r.user?.lastName ? `${r.user.firstName} ${r.user.lastName}` : null)
          let displayName = possibleDisplay
          if (!displayName && createdByVal && typeof createdByVal === 'string' && !createdByVal.includes('@')) {
            displayName = createdByVal
          }

          let handle = r.username || r.user?.username || r.user?.userName || r.userName
          if (!handle && createdByVal && typeof createdByVal === 'string' && createdByVal.includes('@')) {
            handle = createdByVal.split('@')[0]
          }

          return {
            replyId: String(r.commentId || r.replyId || r.id),
            content: r.content || r.replyContent,
            userId: r.userId || r.user?.id,
            username: handle,
            displayName: displayName,
            userEmail: r.userEmail || r.user?.email,
            createdBy: createdByVal,
            createdDate: r.creationDate || r.createdDate,
            // API may provide parentReplyId field (snake or camel)
            parentReplyId: r.parentReplyId || r.parent_reply_id || r.parentReply || null
          }
        })

        // build a tree from mapped replies using parentReplyId
        const nodes = new Map()
        mapped.forEach(n => nodes.set(n.replyId, { ...n, children: [] }))

        const roots = []
        nodes.forEach(node => {
          if (node.parentReplyId) {
            const parent = nodes.get(String(node.parentReplyId))
            if (parent) parent.children.push(node)
            else roots.push(node)
          } else {
            roots.push(node)
          }
        })

        return roots
      }
      return []
    }, [repliesData])

    const replies = (fetched && fetched.length > 0) ? fetched : (initialReplies || [])

    // render a threaded tree recursively
    const renderNode = (node, depth = 0) => (
      <div key={node.replyId} className="bg-gray-50 p-3 md:p-4 rounded-md" style={{ marginLeft: depth * 12 }}>
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-xs">{node.username?.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-xs md:text-sm truncate">
                  <AuthorName displayName={node.displayName} username={node.username} userEmail={node.userEmail} createdBy={node.createdBy} userId={node.userId} />
                </h5>
                <p className="text-xs text-gray-500">
                  {node.createdDate ? formatDateTime(node.createdDate) : ''}
                </p>
              </div>

              {user && node.userId === user.id && (
                <div className="flex space-x-1 ml-2">
                  {editingReply !== node.replyId && (
                    <>
                      <button onClick={() => handleEditReply(node)} className="text-sm text-blue-600 hover:text-blue-800 p-1" title="Edit reply">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                      </button>
                      <button onClick={() => handleDeleteReply(parentId, node.replyId)} className="text-sm text-red-600 hover:text-red-800 p-1" title="Delete reply">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {editingReply === node.replyId ? (
              <div className="mt-2">
                <CommentEditor 
                  value={editReplyText} 
                  onChange={(e) => setEditReplyText(e.target.value)} 
                  onSubmit={() => handleUpdateReply(parentId, node.replyId)} 
                  onCancel={() => { 
                    setEditingReply(null); 
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
                <p className="text-gray-700 text-xs md:text-sm mb-2 break-words">{node.content}</p>
                {user && (
                  <button onClick={() => setReplyTo({ commentId: parentId, replyId: node.replyId })} className="text-xs text-primary-600 hover:text-primary-800 font-medium">Reply</button>
                )}
              </>
            )}

            {/* Reply editor for replying to a specific reply (nested) */}
            {replyTo?.commentId === parentId && replyTo?.replyId === node.replyId && (
              <div className="mt-3">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-xs">{user.username?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <CommentEditor
                      value={replyTexts[`r-${node.replyId}`] || ''}
                      onChange={(e) => setReplyTexts(prev => ({ ...prev, [`r-${node.replyId}`]: e.target.value }))}
                      onSubmit={() => handleReplySubmit(parentId, node.replyId)}
                      onCancel={() => {
                        setReplyTo(null)
                        setReplyTexts(prev => { const c = { ...prev }; delete c[`r-${node.replyId}`]; return c })
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

            {/* render children */}
            {node.children && node.children.length > 0 && (
              <div className="mt-3 space-y-3">
                {node.children.map(child => renderNode(child, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    )

    return (
      <>
        {replies.map(r => renderNode(r))}
      </>
    )
  }
  
  // Check if user is the blog author
  const isBlogAuthor = blog && user && (
    blog.author?.user?.id === user.id || 
    blog.authorUserId === user.id || 
    blog.author?.id === user.id
  )
  
  // Poll for new comments notification (for blog authors)
  useEffect(() => {
    if (!blog || !user || !isBlogAuthor) return
    
    const previousCount = comments.length
    
    const checkForNewComments = () => {
      const currentCount = comments.length
      if (currentCount > previousCount) {
        const newCount = currentCount - previousCount
        setNewCommentsCount(newCount)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
    }
    
    checkForNewComments()
  }, [blog, user, comments.length, isBlogAuthor])
  
  // Handle blog deletion
  const handleDeleteBlog = async () => {
    try {
      deleteBlogMutation.mutate(id)
    } catch (err) {
      console.error('Error deleting blog:', err)
    }
  }
  
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to comment')
      return
    }
    
    if (newComment.trim()) {
      const commentDisplay = user.displayName || user.name || user.username || (user.email ? (user.email.split('@')[0]) : null)
      const commentData = {
        blogId: id,
        userId: user.id,
        content: newComment,
        username: user.username,
        displayName: commentDisplay,
        createdBy: commentDisplay
      }

      const tempId = `temp-${Date.now()}`
      const optimistic = {
        commentId: tempId,
        content: commentData.content,
        userId: commentData.userId,
        username: commentData.username,
        displayName: commentData.displayName,
        userEmail: user.email,
        createdBy: commentData.createdBy,
        createdDate: new Date().toISOString()
      }

      const queryKey = ['comments', 'blog', id]

      try {
        await createCommentMutation.mutateAsync(commentData, {
          onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const previous = queryClient.getQueryData(queryKey)

            const insert = (prev) => {
              if (!prev) return [optimistic]
              const raw = prev.payload || prev.data || prev
              if (Array.isArray(raw)) {
                const newRaw = [optimistic, ...raw]
                if (prev.payload) return { ...prev, payload: newRaw }
                if (prev.data) return { ...prev, data: newRaw }
                return newRaw
              }
              return prev
            }

            queryClient.setQueryData(queryKey, insert(previous))
            return { previous }
          },
          onError: (err, _vars, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
            console.error('Failed to post comment:', err)
            alert('Failed to post comment. Please try again.')
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey })
            setNewComment('')
          }
        })
      } catch (err) {
        // errors handled in onError above
      }
    }
  }
  
  // Handle comment editing
  const handleEditComment = (comment) => {
    setEditingComment(comment.commentId)
    setEditCommentText(comment.content)
  }
  
  const handleUpdateComment = async (commentId) => {
    if (editCommentText.trim()) {
      const updateData = {
        commentId,
        content: editCommentText
      }
      updateCommentMutation.mutate(updateData)
    }
  }
  
  const handleDeleteComment = async (commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const commentsKey = ['comments', 'blog', id]
      await queryClient.cancelQueries({ queryKey: commentsKey })
      const previous = queryClient.getQueryData(commentsKey)

      const remove = (prev) => {
        if (!prev) return prev
        const raw = prev.payload || prev.data || prev
        if (Array.isArray(raw)) {
          const newRaw = raw.filter(c => String((c.commentId || c.id)) !== String(commentId))
          if (prev.payload) return { ...prev, payload: newRaw }
          if (prev.data) return { ...prev, data: newRaw }
          return newRaw
        }
        return prev
      }

      queryClient.setQueryData(commentsKey, remove(previous))

      try {
        await deleteCommentMutation.mutateAsync(commentId)
        queryClient.invalidateQueries({ queryKey: commentsKey })
      } catch (err) {
        // rollback
        if (previous) queryClient.setQueryData(commentsKey, previous)
        console.error('Error deleting comment:', err)
        alert('Failed to delete comment. Please try again.')
      }
    }
  }
  
  // Handle reply submission (supports nested replies via optional parentReplyId)
  const handleReplySubmit = async (commentId, parentReplyId = null) => {
    if (!user) {
      alert('Please sign in to reply')
      return
    }

    const key = parentReplyId ? `r-${parentReplyId}` : `c-${commentId}`
    const text = (replyTexts[key] || '').trim()
    if (!text) return

    const replyDisplay = user.displayName || user.name || user.username || (user.email ? (user.email.split('@')[0]) : null)
    const replyData = {
      // backend often expects parentCommentId
      parentCommentId: commentId,
      parentReplyId: parentReplyId,
      commentId: commentId,
      blogId: id,
      userId: user.id,
      content: text,
      username: user.username,
      displayName: replyDisplay,
      createdBy: replyDisplay
    }

    const tempId = `temp-reply-${Date.now()}`
    const optimisticReply = {
      replyId: tempId,
      content: replyData.content,
      userId: replyData.userId,
      username: replyData.username,
      displayName: replyData.displayName,
      userEmail: user.email,
      createdBy: replyData.createdBy,
      createdDate: new Date().toISOString(),
      parentReplyId: parentReplyId
    }

    const repliesKey = ['comments', 'replies', commentId]

    try {
      await createReplyMutation.mutateAsync(replyData, {
        onMutate: async () => {
          await queryClient.cancelQueries({ queryKey: repliesKey })
          const previous = queryClient.getQueryData(repliesKey)
          const commentsKey = ['comments', 'blog', id]
          const previousComments = queryClient.getQueryData(commentsKey)

          const insert = (prev) => {
            if (!prev) return [optimisticReply]
            const raw = prev.payload || prev.data || prev
            if (Array.isArray(raw)) {
              const newRaw = [optimisticReply, ...raw]
              if (prev.payload) return { ...prev, payload: newRaw }
              if (prev.data) return { ...prev, data: newRaw }
              return newRaw
            }
            return prev
          }

          queryClient.setQueryData(repliesKey, insert(previous))
          // also insert into comments cache under the specific parent comment -> replies
          if (previousComments) {
            const updateComments = (prev) => {
              if (!prev) return prev
              const raw = prev.payload || prev.data || prev
              if (Array.isArray(raw)) {
                const newRaw = raw.map(c => {
                  if (String(c.commentId || c.id) !== String(commentId)) return c
                  const replies = c.replies || []
                  if (!parentReplyId) {
                    // top-level reply: prepend
                    const replyNode = {
                      replyId: optimisticReply.replyId,
                      content: optimisticReply.content,
                      userId: optimisticReply.userId,
                      username: optimisticReply.username,
                      displayName: optimisticReply.displayName,
                      userEmail: optimisticReply.userEmail,
                      createdBy: optimisticReply.createdBy,
                      createdDate: optimisticReply.createdDate
                    }
                    return { ...c, replies: [replyNode, ...replies] }
                  } else {
                    // nested reply: attach under the matching reply as children
                    const newReplies = replies.map(r => {
                      if (String(r.replyId) === String(parentReplyId)) {
                        const children = r.children || []
                        const childNode = {
                          replyId: optimisticReply.replyId,
                          content: optimisticReply.content,
                          userId: optimisticReply.userId,
                          username: optimisticReply.username,
                          displayName: optimisticReply.displayName,
                          userEmail: optimisticReply.userEmail,
                          createdBy: optimisticReply.createdBy,
                          createdDate: optimisticReply.createdDate,
                          parentReplyId: optimisticReply.parentReplyId
                        }
                        return { ...r, children: [...children, childNode] }
                      }
                      return r
                    })
                    return { ...c, replies: newReplies }
                  }
                })
                if (prev.payload) return { ...prev, payload: newRaw }
                if (prev.data) return { ...prev, data: newRaw }
                return newRaw
              }
              return prev
            }

            queryClient.setQueryData(commentsKey, updateComments(previousComments))
          }
          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) queryClient.setQueryData(repliesKey, ctx.previous)
          console.error('Failed to post reply:', err)
          alert('Failed to post reply. Please try again.')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: repliesKey })
          queryClient.invalidateQueries(['comments', 'blog', id])
          // clear only this reply editor content
          setReplyTexts(prev => { const c = { ...prev }; delete c[key]; return c })
          setReplyTo(null)
        }
      })
    } catch (err) {
      // handled in onError
    }
  }
  
  // Handle reply editing
  const handleEditReply = (reply) => {
    setEditingReply(reply.replyId)
    setEditReplyText(reply.content)
  }
  
  const handleUpdateReply = async (commentId, replyId) => {
    if (editReplyText.trim()) {
      const updateData = {
        replyId,
        content: editReplyText
      }
      updateReplyMutation.mutate(updateData, {
        onSuccess: () => {
          queryClient.invalidateQueries(['comments', 'replies', commentId])
        }
      })
    }
  }
  
  const handleDeleteReply = async (commentId, replyId) => {
    if (confirm('Are you sure you want to delete this reply?')) {
      const repliesKey = ['comments', 'replies', commentId]
      const commentsKey = ['comments', 'blog', id]

      await queryClient.cancelQueries({ queryKey: repliesKey })
      await queryClient.cancelQueries({ queryKey: commentsKey })

      const previousReplies = queryClient.getQueryData(repliesKey)
      const previousComments = queryClient.getQueryData(commentsKey)

      const removeReply = (prev) => {
        if (!prev) return prev
        const raw = prev.payload || prev.data || prev
        if (Array.isArray(raw)) {
          const newRaw = raw.filter(r => String((r.replyId || r.commentId || r.id)) !== String(replyId))
          if (prev.payload) return { ...prev, payload: newRaw }
          if (prev.data) return { ...prev, data: newRaw }
          return newRaw
        }
        return prev
      }

      const removeFromComments = (prev) => {
        if (!prev) return prev
        const raw = prev.payload || prev.data || prev
        if (Array.isArray(raw)) {
          const removeNested = (arr) => {
            return arr.reduce((acc, r) => {
              if (String((r.replyId || r.commentId || r.id)) === String(replyId)) return acc
              const copy = { ...r }
              if (copy.children && Array.isArray(copy.children)) {
                copy.children = removeNested(copy.children)
              }
              if (copy.replies && Array.isArray(copy.replies)) {
                copy.replies = removeNested(copy.replies)
              }
              acc.push(copy)
              return acc
            }, [])
          }

          const newRaw = raw.map(c => {
            const replies = c.replies || []
            const filtered = removeNested(replies)
            return { ...c, replies: filtered }
          })
          if (prev.payload) return { ...prev, payload: newRaw }
          if (prev.data) return { ...prev, data: newRaw }
          return newRaw
        }
        return prev
      }

      queryClient.setQueryData(repliesKey, removeReply(previousReplies))
      queryClient.setQueryData(commentsKey, removeFromComments(previousComments))

      try {
        await deleteReplyMutation.mutateAsync(replyId)
        queryClient.invalidateQueries({ queryKey: repliesKey })
        queryClient.invalidateQueries({ queryKey: commentsKey })
      } catch (err) {
        // rollback
        if (previousReplies) queryClient.setQueryData(repliesKey, previousReplies)
        if (previousComments) queryClient.setQueryData(commentsKey, previousComments)
        console.error('Error deleting reply:', err)
        alert('Failed to delete reply. Please try again.')
      }
    }
  }

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
      <div className="relative h-64 md:h-80 lg:h-96 bg-gray-900">
        {blog.imageUrl ? (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 md:h-24 md:w-24 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Blog Content */}
      <div className="container-custom py-4 md:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4 md:mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>

          {/* Blog Header */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{blog.title}</h1>
            
            {/* Category Badge */}
            {blog.categoryName && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {blog.categoryName}
                </span>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b gap-4">
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
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm md:text-base inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm md:text-base inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Blog Content */}
            <div className="prose prose-sm md:prose-lg max-w-none">
              <div 
                className="text-base md:text-lg leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            {user ? (
              <div className="mb-6 md:mb-8">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-xs md:text-sm">
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
              <div className="mb-6 md:mb-8 p-4 bg-gray-50 rounded-md text-center">
                <p className="text-gray-600 text-sm md:text-base">
                  <Link to="/sign-in" className="text-primary-600 hover:text-primary-800 font-medium">
                    Sign in
                  </Link> to join the conversation
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 md:space-y-6">
              {comments.map(comment => (
                <div key={comment.commentId} className="border-b pb-4 md:pb-6 last:border-b-0">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs md:text-sm">
                          {comment.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Comment Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm md:text-base truncate">
                            <AuthorName displayName={comment.displayName} username={comment.username} userEmail={comment.userEmail} createdBy={comment.createdBy} userId={comment.userId} />
                          </h4>
                          <p className="text-xs md:text-sm text-gray-500">
                            {comment.createdDate ? formatDateTime(comment.createdDate) : ''}
                          </p>
                        </div>

                        {/* Comment Actions */}
                        {user && comment.userId === user.id && (
                          <div className="flex space-x-1 md:space-x-2 ml-2">
                            {editingComment !== comment.commentId && (
                              <>
                                <button
                                  onClick={() => handleEditComment(comment)}
                                  className="text-sm text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit comment"
                                >
                                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.commentId)}
                                  className="text-sm text-red-600 hover:text-red-800 p-1"
                                  title="Delete comment"
                                >
                                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comment Content */}
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
                          <p className="text-gray-700 mb-3 text-sm md:text-base break-words">{comment.content}</p>
                          
                          {/* Reply Button */}
                          {user && (
                            <button
                              onClick={() => setReplyTo({ commentId: comment.commentId })}
                              className="text-xs md:text-sm text-primary-600 hover:text-primary-800 font-medium"
                            >
                              Reply
                            </button>
                          )}
                        </>
                      )}

                      {/* Reply Form */}
                      {replyTo?.commentId === comment.commentId && !replyTo?.replyId && (
                        <div className="mt-3 ml-4 md:ml-8">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-600 font-semibold text-xs">
                                  {user.username?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <CommentEditor
                                value={replyTexts[`c-${comment.commentId}`] || ''}
                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [`c-${comment.commentId}`]: e.target.value }))}
                                onSubmit={() => handleReplySubmit(comment.commentId)}
                                onCancel={() => {
                                  setReplyTo(null)
                                  setReplyTexts(prev => { const c = { ...prev }; delete c[`c-${comment.commentId}`]; return c })
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

                      <div className="ml-4 md:ml-8 mt-4 space-y-3 md:space-y-4">
                        <Replies parentId={comment.commentId} initialReplies={comment.replies} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-6 md:py-8 text-sm md:text-base">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full">
            <h3 className="text-lg md:text-xl font-bold mb-4">Delete Blog</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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