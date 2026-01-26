import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { notification, Modal } from 'antd'
import HeroSection from '../components/HeroSection'
import CommentEditor from '../components/CommentEditor'
import { useAuth } from '../contexts/AuthContext'
import { 
  useGetAllQuestions,
  useGetUserQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion
} from '../services/query/queue'
import {
  useGetAnswersByQuestion,
  useCreateAnswer,
  useReplyToAnswer,
  useUpdateAnswer,
  useDeleteAnswer
} from '../services/query/answer'


function QA() {
  const { user } = useAuth()
  
  // React Query hooks
  const { data: userQuestionsData, isLoading: isLoadingUserQuestions } = useGetUserQuestions(
    user?.id,
    0,
    50,
    'creationDate',
    'desc'
  )
  
  const { data: allQuestionsData, isLoading: isLoadingAllQuestions, refetch: refetchQuestions } = useGetAllQuestions(
    0,
    50,
    'creationDate',
    'desc'
  )
  
  const createQuestionMutation = useCreateQuestion()
  const updateQuestionMutation = useUpdateQuestion()
  const deleteQuestionMutation = useDeleteQuestion()
  
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  
  // Answer states
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())
  const [currentQuestionId, setCurrentQuestionId] = useState(null)
  const [answerText, setAnswerText] = useState({}) // { questionId: text }
  const [replyText, setReplyText] = useState({}) // { answerId: text }
  const [editingAnswer, setEditingAnswer] = useState(null)
  const [editAnswerContent, setEditAnswerContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  
  // React Query mutations for answers
  const createAnswerMutation = useCreateAnswer()
  const replyToAnswerMutation = useReplyToAnswer()
  const updateAnswerMutation = useUpdateAnswer()
  const deleteAnswerMutation = useDeleteAnswer()
  
  // Fetch answers for expanded question
  const { data: answersData, isLoading: isLoadingAnswers, refetch: refetchAnswers } = useGetAnswersByQuestion(currentQuestionId)
  
  // Get questions from React Query
  const questions = allQuestionsData?.payload?.content || allQuestionsData?.content || []
  
  // Check user role
  const isAuthor = user?.userType?.includes('AUTHOR')

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const toggleQuestion = (questionId) => {
    if (!questionId) return
    
    const newExpanded = new Set(expandedQuestions)
    
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
      if (currentQuestionId === questionId) {
        setCurrentQuestionId(null)
      }
    } else {
      newExpanded.add(questionId)
      setCurrentQuestionId(questionId)
    }
    
    setExpandedQuestions(newExpanded)
  }



  const handleAddAnswer = (questionId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to answer questions',
        placement: 'topRight'
      })
      return
    }

    // Only AUTHORS can answer questions
    if (!isAuthor) {
      notification.info({
        title: 'Authors Only',
        description: 'Only authors (experts) can answer questions. You can reply to existing answers.',
        placement: 'topRight',
        duration: 5
      })
      return
    }

    const content = answerText[questionId]?.trim()
    if (!content) {
      notification.warning({
        title: 'Empty Answer',
        description: 'Please enter an answer',
        placement: 'topRight'
      })
      return
    }

    const answerData = {
      questionId: questionId,
      userId: user.id,
      content: content
    }

    createAnswerMutation.mutate(answerData, {
      onSuccess: () => {
        setAnswerText(prev => ({ ...prev, [questionId]: '' }))
        refetchAnswers()
        refetchQuestions()
        notification.success({
          title: 'Answer Posted',
          description: 'Your expert answer has been added successfully!',
          placement: 'topRight'
        })
      },
      onError: (error) => {
        console.error('Error adding answer:', error)
        notification.error({
          title: 'Failed to Post Answer',
          description: 'Failed to add answer. Please try again.',
          placement: 'topRight'
        })
      }
    })
  }

  const handleReplyToAnswer = (questionId, parentAnswerId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to reply',
        placement: 'topRight'
      })
      return
    }

    const content = replyText[parentAnswerId]?.trim()
    if (!content) {
      notification.warning({
        title: 'Empty Reply',
        description: 'Please enter a reply',
        placement: 'topRight'
      })
      return
    }

    const replyData = {
      questionId: questionId,
      userId: user.id,
      parentAnswerId: parentAnswerId,
      content: content  // Try 'content' instead of 'answerContent'
    }

    replyToAnswerMutation.mutate(replyData, {
      onSuccess: () => {
        setReplyText(prev => ({ ...prev, [parentAnswerId]: '' }))
        setReplyingTo(null)
        refetchAnswers()
        notification.success({
          title: 'Reply Posted',
          description: 'Your reply has been added successfully!',
          placement: 'topRight'
        })
      },
      onError: (error) => {
        console.error('Error adding reply:', error)
        notification.error({
          title: 'Failed to Post Reply',
          description: 'Failed to add reply. Please try again.',
          placement: 'topRight'
        })
      }
    })
  }

  const handleEditAnswer = (answer) => {
    setEditingAnswer(answer.answerId || answer.id)
    setEditAnswerContent(answer.answerContent || answer.content)
  }

  const handleUpdateAnswer = (questionId, answerId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to update',
        placement: 'topRight'
      })
      return
    }

    const updateData = {
      answerId: answerId,
      content: editAnswerContent  // Try 'content' instead of 'answerContent'
    }

    updateAnswerMutation.mutate(updateData, {
      onSuccess: () => {
        setEditingAnswer(null)
        setEditAnswerContent('')
        refetchAnswers()
        notification.success({
          title: 'Answer Updated',
          description: 'Your answer has been updated successfully!',
          placement: 'topRight'
        })
      },
      onError: (error) => {
        console.error('Error updating answer:', error)
        notification.error({
          title: 'Update Failed',
          description: 'Failed to update answer. Please try again.',
          placement: 'topRight'
        })
      }
    })
  }

  const handleDeleteAnswer = (questionId, answerId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to delete',
        placement: 'topRight'
      })
      return
    }

    // Check if we have a valid answer ID from backend
    if (!answerId || answerId.toString().startsWith('temp-')) {
      notification.error({
        title: 'Cannot Delete Answer',
        description: 'Backend API error: Answer ID is missing. Please contact the administrator to fix the /api/answers/question endpoint to include the answer ID field.',
        placement: 'topRight',
        duration: 8
      })
      return
    }

    Modal.confirm({
      title: 'Delete Answer',
      content: 'Are you sure you want to delete this answer?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteAnswerMutation.mutate(answerId, {
          onSuccess: () => {
            refetchAnswers()
            refetchQuestions()
            notification.success({
              title: 'Answer Deleted',
              description: 'Answer has been deleted successfully!',
              placement: 'topRight'
            })
          },
          onError: (error) => {
            console.error('Error deleting answer:', error)
            notification.error({
              title: 'Deletion Failed',
              description: 'Failed to delete answer. Please try again.',
              placement: 'topRight'
            })
          }
        })
      }
    })
  }

  const handleEdit = (q) => {
    setEditingQuestion(q.id || q.questionId)
    setEditTitle(q.title)
    setEditContent(q.content)
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setEditTitle('')
    setEditContent('')
  }

  const handleUpdate = async (questionId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to update a question',
        placement: 'topRight'
      })
      return
    }

    const questionData = {
      questionId: questionId,
      title: editTitle,
      content: editContent
    }
    
    updateQuestionMutation.mutate(questionData, {
      onSuccess: () => {
        handleCancelEdit()
        refetchQuestions()
        notification.success({
          title: 'Question Updated',
          description: 'Your question has been updated successfully!',
          placement: 'topRight'
        })
      },
      onError: (error) => {
        console.error('Error updating question:', error)
        notification.error({
          title: 'Update Failed',
          description: 'Failed to update question. Please try again.',
          placement: 'topRight'
        })
      }
    })
  }

  const handleDelete = async (questionId) => {
    if (!user) {
      notification.warning({
        title: 'Authentication Required',
        description: 'Please sign in to delete a question',
        placement: 'topRight'
      })
      return
    }

    Modal.confirm({
      title: 'Delete Question',
      content: 'Are you sure you want to delete this question?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteQuestionMutation.mutate(questionId, {
          onSuccess: () => {
            refetchQuestions()
            notification.success({
              title: 'Question Deleted',
              description: 'Question has been deleted successfully!',
              placement: 'topRight'
            })
          },
          onError: (error) => {
            console.error('Error deleting question:', error)
            notification.error({
              title: 'Deletion Failed',
              description: 'Failed to delete question. Please try again.',
              placement: 'topRight'
            })
          }
        })
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to ask a question')
      return
    }
    
    const questionData = {
      title: title.trim(),
      content: question.trim()
    }
    
    createQuestionMutation.mutate(questionData, {
      onSuccess: () => {
        // Reset form
        setTitle('')
        setQuestion('')
        
        refetchQuestions()
        notification.success({
          title: 'Question Posted',
          description: 'Your question has been submitted successfully!',
          placement: 'topRight'
        })
      },
      onError: (error) => {
        console.error('Error submitting question:', error)
        notification.error({
          title: 'Submission Failed',
          description: 'Failed to submit question. Please try again.',
          placement: 'topRight'
        })
      }
    })
  }
  
  // Quill editor modules - same as BlogForm
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        ['blockquote', 'code-block']
      ]
    }
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ]
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Community Q&A"
        subtitle="Connect with fellow farmers and get answers to your farming questions"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Ask Question Section - Only for logged-in users */}
      <section className="py-12 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Ask question</h2>
              <span className="text-sm text-gray-500">Required fields <span className="text-red-500">*</span></span>
            </div>
            
            {!user ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-800 font-medium">Please sign in to ask a question</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your question title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <div className="quill-editor-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={question}
                      onChange={setQuestion}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your blog content here..."
                      className="bg-white"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {question.replace(/<[^>]*>/g, '').length} characters
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('')
                      setQuestion('')
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createQuestionMutation.isPending}
                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createQuestionMutation.isPending ? 'Saving...' : 'Post Question'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      
      {/* My Questions - Grid View (Similar to Crops) */}
      {user && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">My Questions</h2>
            
            {isLoadingUserQuestions ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : userQuestionsData?.payload?.content && userQuestionsData.payload.content.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userQuestionsData.payload.content.map((item, index) => (
                    <div key={item.id || `question-${index}`} className="card">
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                            {formatDate(item.creationDate)}
                          </span>
                        </div>
                        <div 
                          className="text-gray-700 mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                        
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Asked by:</span>
                            <span className="font-medium">{item.user?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-xs">{item.user?.email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">User Type:</span>
                            <span className="font-medium">
                              {item.user?.userTypes?.join(', ') || 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">User Roles:</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.user?.roles?.map((role) => (
                              <span 
                                key={role.roleId || role.id || role.roleName} 
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {role.roleName}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button className="btn-primary w-full" onClick={() => toggleQuestion(item.id)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Info */}
                {userQuestionsData?.payload?.totalElements && (
                  <div className="text-center mt-8 text-gray-600">
                    <p>
                      Showing {userQuestionsData.payload.numberOfElements} of {userQuestionsData.payload.totalElements} questions
                      {userQuestionsData.payload.totalPages > 1 && (
                        <span> • Page {userQuestionsData.payload.number + 1} of {userQuestionsData.payload.totalPages}</span>
                      )}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">You haven't asked any questions yet.</p>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Questions Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Community Questions</h2>
          
          {!user ? (
            /* Show sign-up message when user is not logged in */
            <div className="text-center py-16 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-primary-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Join the Farming Community</h3>
                <p className="text-gray-600 mb-6">
                  Sign up to ask questions, share your farming experiences, and get expert answers from fellow farmers and agricultural specialists.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    to="/sign-up"
                    state={{ from: '/qa' }}
                    className="btn-primary py-3 px-8 text-lg inline-block text-center"
                  >
                    Sign Up Now
                  </Link>
                  <Link 
                    to="/sign-in"
                    state={{ from: '/qa' }}
                    className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 font-medium text-lg inline-block text-center"
                  >
                    Sign In
                  </Link>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Already have an account? <Link to="/sign-in" state={{ from: '/qa' }} className="text-primary-600 hover:text-primary-800 font-medium">Sign in here</Link>
                </p>
              </div>
            </div>
          ) : isLoadingAllQuestions ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {questions.map((q) => {
                const questionId = q.id || q.questionId
                const isOwner = user && (q.userId === user.id)
                const isEditing = editingQuestion === questionId
                const isExpanded = expandedQuestions.has(questionId)
                
                // Safely parse answers data - ensure it's always an array
                let answers = []
                if (currentQuestionId === questionId && answersData) {
                  const data = answersData?.payload || answersData?.content || answersData
                  answers = Array.isArray(data) ? data : []
                }
                
                return (
                  <div key={questionId} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {isEditing ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                            <div className="quill-editor-wrapper">
                              <ReactQuill
                                theme="snow"
                                value={editContent}
                                onChange={setEditContent}
                                modules={modules}
                                formats={formats}
                                placeholder="Write your question content here..."
                                className="bg-white"
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              {editContent.replace(/<[^>]*>/g, '').length} characters
                            </p>
                          </div>
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={handleCancelEdit}
                              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdate(questionId)}
                              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex-1 cursor-pointer hover:text-primary-600" onClick={() => toggleQuestion(questionId)}>
                              {q.title}
                            </h3>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => toggleQuestion(questionId)}
                                className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap hover:bg-green-200 transition-colors"
                              >
                                {q.answersCount || 0} {q.answersCount === 1 ? 'Answer' : 'Answers'}
                              </button>
                              {isOwner && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEdit(q)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit question"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(questionId)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete question"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => toggleQuestion(questionId)}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div 
                            className="text-gray-700 mb-4"
                            dangerouslySetInnerHTML={{ __html: q.content }}
                          />
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Asked by {q.username || 'Unknown User'}</span>
                            <span>{formatDate(q.createdDate)}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Answers Section */}
                    {isExpanded && !isEditing && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        {/* Add Answer Form - Only for AUTHOR users */}
                        {isAuthor ? (
                          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ✍️ Your Expert Answer
                            </label>
                            <CommentEditor
                              value={answerText[questionId] || ''}
                              onChange={(e) => setAnswerText({ ...answerText, [questionId]: e.target.value })}
                              onSubmit={() => handleAddAnswer(questionId)}
                              placeholder="Share your expert knowledge..."
                              submitLabel="Post Expert Answer"
                              rows={3}
                              size="medium"
                            />
                          </div>
                        ) : user ? (
                          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-800 text-sm">💡 Only authors (experts) can answer questions. You can reply to their answers below.</p>
                          </div>
                        ) : (
                          <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 text-sm">Please sign in to interact with answers</p>
                          </div>
                        )}
                        
                        {/* Answers List */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h4>
                          
                          {(currentQuestionId === questionId && isLoadingAnswers) ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                          ) : !Array.isArray(answers) || answers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No answers yet. Be the first to answer!</p>
                          ) : (
                            Array.isArray(answers) && answers.map((answer, index) => {
                              // BACKEND ISSUE: API doesn't return answer ID
                              // Using index as temporary key until backend is fixed
                              const answerId = answer.id || answer.answerId || `temp-${index}`
                              const isAnswerOwner = user && (answer.userId === user.id)
                              const isEditingAnswer = editingAnswer === answerId
                              const isReplyingToThis = replyingTo === answerId
                              
                              return (
                                <div key={answerId} className="bg-white p-4 rounded-lg border border-gray-200">
                                  {isEditingAnswer ? (
                                    <div className="space-y-2">
                                      <textarea
                                        rows="3"
                                        value={editAnswerContent}
                                        onChange={(e) => setEditAnswerContent(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleUpdateAnswer(questionId, answerId)}
                                          className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => { setEditingAnswer(null); setEditAnswerContent('') }}
                                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-start mb-2">
                                        <p className="text-gray-700 flex-1">{answer.answerContent || answer.content}</p>
                                        {isAnswerOwner && (
                                          <div className="flex gap-1 ml-2">
                                            <button
                                              onClick={() => handleEditAnswer(answer)}
                                              className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                                              title="Edit answer"
                                            >
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                            </button>
                                            <button
                                              onClick={() => handleDeleteAnswer(questionId, answerId)}
                                              className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                                              title="Delete answer"
                                            >
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>Answered by {answer.username || 'Unknown User'}</span>
                                        <span>{formatDate(answer.createdDate)}</span>
                                      </div>
                                      {user && (
                                        <button
                                          onClick={() => setReplyingTo(replyingTo === answerId ? null : answerId)}
                                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                          {isReplyingToThis ? 'Cancel Reply' : 'Reply'}
                                        </button>
                                      )}
                                      
                                      {/* Reply Form */}
                                      {isReplyingToThis && (
                                        <div className="mt-3 pl-4 border-l-2 border-primary-200 relative">
                                          <div className="relative z-10">
                                            <CommentEditor
                                              value={replyText[answerId] || ''}
                                              onChange={(e) => setReplyText({ ...replyText, [answerId]: e.target.value })}
                                              onSubmit={() => handleReplyToAnswer(questionId, answerId)}
                                              onCancel={() => setReplyingTo(null)}
                                              placeholder="Write your reply..."
                                              submitLabel="Post Reply"
                                              showCancel={true}
                                              rows={2}
                                              size="small"
                                              emojiPosition="top"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          
          {!isLoadingAllQuestions && questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Community Stats Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1,250+</div>
              <p className="text-lg text-gray-600">Questions Answered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">780</div>
              <p className="text-lg text-gray-600">Active Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24h</div>
              <p className="text-lg text-gray-600">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default QA
