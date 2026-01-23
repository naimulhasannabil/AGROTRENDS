import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import { useAuth } from '../contexts/AuthContext'
import { 
  getAllQuestions, 
  getQuestionsByUserId, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  addAnswer,
  replyToAnswer,
  updateAnswer,
  deleteAnswer,
  getAnswersByQuestionId
} from '../services/qaService'

function QA() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Check user role
  const isAuthor = user?.userType?.includes('AUTHOR')
  const isConsumer = user?.userType?.includes('CONSUMER')
  
  // Default view: AUTHOR sees all questions, CONSUMER sees their own
  const [viewMode, setViewMode] = useState('all') // Always show all questions by default
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  
  // Answer states
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())
  const [questionAnswers, setQuestionAnswers] = useState({}) // { questionId: [answers] }
  const [answerText, setAnswerText] = useState({}) // { questionId: text }
  const [replyText, setReplyText] = useState({}) // { answerId: text }
  const [editingAnswer, setEditingAnswer] = useState(null)
  const [editAnswerContent, setEditAnswerContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [loadingAnswers, setLoadingAnswers] = useState({})
  
  // Sample FAQs for fallback
  const sampleFaqs = [
    {
      id: 1,
      title: "What's the best time to plant wheat?",
      content: "The optimal time to plant wheat depends on your region. In most temperate climates, winter wheat is planted in fall (September to November) and harvested in summer, while spring wheat is planted in early spring and harvested in late summer.",
      username: "John D.",
      createdDate: "2025-05-05T10:00:00Z",
      answers: [],
      answersCount: 3
    },
    {
      id: 2,
      title: "How can I naturally control aphids in my vegetable garden?",
      content: "Several natural methods can control aphids: introduce beneficial insects like ladybugs, use neem oil spray, create a soap spray with mild liquid soap and water, plant aphid-repelling companions like marigolds, or use a strong water spray to physically remove them from plants.",
      username: "Sarah W.",
      createdDate: "2025-04-28T10:00:00Z",
      answers: [],
      answersCount: 5
    },
    {
      id: 3,
      title: "What are the signs of nitrogen deficiency in plants?",
      content: "Signs of nitrogen deficiency include yellowing of older leaves (chlorosis) starting from the tip and moving along the center, stunted growth, smaller leaves, and reduced yields. The entire plant may appear pale green to yellowish compared to healthy plants.",
      username: "Michael K.",
      createdDate: "2025-04-22T10:00:00Z",
      answers: [],
      answersCount: 2
    }
  ]

  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, viewMode])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // Always fetch all questions for both AUTHOR and CONSUMER
      const data = await getAllQuestions(0, 50, 'creationDate', 'desc')
      
      console.log('Fetched questions:', data)
      
      // Always set questions from API, even if empty
      // This ensures we show real data, not sample FAQs
      setQuestions(data)
      
      // Only show sample FAQs if API returned empty AND we have no questions yet
      if (data.length === 0 && questions.length === 0) {
        setQuestions(sampleFaqs)
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      // Only use sample data on error if we have no existing questions
      if (questions.length === 0) {
        setQuestions(sampleFaqs)
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  const toggleQuestion = async (questionId) => {
    const newExpanded = new Set(expandedQuestions)
    
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
      // Fetch answers if not already loaded
      if (!questionAnswers[questionId]) {
        await fetchAnswers(questionId)
      }
    }
    
    setExpandedQuestions(newExpanded)
  }

  const fetchAnswers = async (questionId) => {
    try {
      setLoadingAnswers(prev => ({ ...prev, [questionId]: true }))
      const data = await getAnswersByQuestionId(questionId)
      
      // Service already normalizes and handles pagination
      setQuestionAnswers(prev => ({ ...prev, [questionId]: data }))
    } catch (error) {
      console.error('Error fetching answers:', error)
      setQuestionAnswers(prev => ({ ...prev, [questionId]: [] }))
    } finally {
      setLoadingAnswers(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleAddAnswer = async (questionId) => {
    if (!user) {
      alert('Please sign in to answer')
      return
    }

    // Only AUTHORS can answer questions
    if (!isAuthor) {
      alert('Only authors (experts) can answer questions. You can reply to existing answers.')
      return
    }

    const content = answerText[questionId]?.trim()
    if (!content) {
      alert('Please enter an answer')
      return
    }

    try {
      const newAnswer = await addAnswer(questionId, user.id, content)
      
      // Clear the answer text
      setAnswerText(prev => ({ ...prev, [questionId]: '' }))
      
      // Refresh answers from server to get complete data
      await fetchAnswers(questionId)
      
      // Update answer count in questions list
      setQuestions(questions.map(q => {
        const qId = q.id || q.questionId
        return qId === questionId ? { ...q, answersCount: (q.answersCount || 0) + 1 } : q
      }))
      
      alert('Answer added successfully!')
    } catch (error) {
      console.error('Error adding answer:', error)
      alert('Failed to add answer. Please try again.')
    }
  }

  const handleReplyToAnswer = async (questionId, parentAnswerId) => {
    if (!user) {
      alert('Please sign in to reply')
      return
    }

    const content = replyText[parentAnswerId]?.trim()
    if (!content) {
      alert('Please enter a reply')
      return
    }

    try {
      await replyToAnswer(questionId, user.id, parentAnswerId, content)
      // Refresh answers to show the new reply
      await fetchAnswers(questionId)
      setReplyText(prev => ({ ...prev, [parentAnswerId]: '' }))
      setReplyingTo(null)
      alert('Reply added successfully!')
    } catch (error) {
      console.error('Error adding reply:', error)
      alert('Failed to add reply. Please try again.')
    }
  }

  const handleEditAnswer = (answer) => {
    setEditingAnswer(answer.answerId || answer.id)
    setEditAnswerContent(answer.answerContent || answer.content)
  }

  const handleUpdateAnswer = async (questionId, answerId) => {
    if (!user) {
      alert('Please sign in to update')
      return
    }

    try {
      await updateAnswer(answerId, editAnswerContent)
      await fetchAnswers(questionId)
      setEditingAnswer(null)
      setEditAnswerContent('')
      alert('Answer updated successfully!')
    } catch (error) {
      console.error('Error updating answer:', error)
      alert('Failed to update answer. Please try again.')
    }
  }

  const handleDeleteAnswer = async (questionId, answerId) => {
    if (!user) {
      alert('Please sign in to delete')
      return
    }

    if (!confirm('Are you sure you want to delete this answer?')) {
      return
    }

    try {
      await deleteAnswer(answerId)
      await fetchAnswers(questionId)
      
      // Update answer count in questions list
      setQuestions(questions.map(q => {
        const qId = q.id || q.questionId
        return qId === questionId ? { ...q, answersCount: Math.max((q.answersCount || 1) - 1, 0) } : q
      }))
      
      alert('Answer deleted successfully!')
    } catch (error) {
      console.error('Error deleting answer:', error)
      alert('Failed to delete answer. Please try again.')
    }
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
      alert('Please sign in to update a question')
      return
    }

    try {
      const questionData = {
        questionId: questionId,
        title: editTitle,
        content: editContent
      }
      
      const updatedQuestion = await updateQuestion(questionData)
      console.log('Question updated:', updatedQuestion)
      
      // Update the question in the list
      setQuestions(questions.map(q => 
        (q.id === questionId || q.questionId === questionId) ? updatedQuestion : q
      ))
      
      handleCancelEdit()
      alert('Question updated successfully!')
    } catch (error) {
      console.error('Error updating question:', error)
      alert('Failed to update question. Please try again.')
    }
  }

  const handleDelete = async (questionId) => {
    if (!user) {
      alert('Please sign in to delete a question')
      return
    }

    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }

    try {
      await deleteQuestion(questionId)
      console.log('Question deleted:', questionId)
      
      // Remove the question from the list
      setQuestions(questions.filter(q => 
        q.id !== questionId && q.questionId !== questionId
      ))
      
      alert('Question deleted successfully!')
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please sign in to ask a question')
      return
    }
    
    // Only CONSUMER users can create questions
    if (!isConsumer) {
      alert('Only users (consumers) can ask questions. Authors can answer questions.')
      return
    }
    
    try {
      setSubmitting(true)
      const questionData = {
        userId: user.id,
        title: title,
        content: question
      }
      
      const newQuestion = await createQuestion(questionData)
      console.log('Question created:', newQuestion)
      
      // Reset form
      setTitle('')
      setQuestion('')
      setCategory('')
      
      alert('Question submitted successfully!')
      
      // Add a small delay to ensure backend has committed the data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Refresh the questions list to get updated data from server
      await fetchQuestions()
    } catch (error) {
      console.error('Error submitting question:', error)
      alert('Failed to submit question. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  // FAQ categories
  const categories = [
    "Crops", 
    "Livestock", 
    "Soil Management", 
    "Pest Control", 
    "Irrigation", 
    "Farm Equipment", 
    "Organic Farming"
  ]
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection 
        title="Community Q&A"
        subtitle="Connect with fellow farmers and get answers to your farming questions"
        backgroundClass="bg-[#DAFCE7]"
      />
      
      {/* Ask Question Section - Only for CONSUMER users */}
      {isConsumer && (
        <section className="py-12 bg-white">
          <div className="container-custom max-w-4xl">
            <div className="bg-[#DAFCE7] rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Ask a Question</h2>
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your question title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
  id="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
  required
>
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
              </div>
              <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Question
                </label>
                <textarea
                  id="question"
                  rows="4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your farming question here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting || !user}
                className="btn-primary rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Question'}
              </button>
              {!user && (
                <p className="text-sm text-red-600 mt-2">Please sign in to ask a question</p>
              )}
            </form>
          </div>
        </div>
      </section>
      )}
      
      {/* Info message for AUTHORS */}
      {isAuthor && (
        <section className="py-8 bg-blue-50">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">👨‍🏫 Author Mode</h3>
              <p className="text-blue-700">You can view all community questions and provide expert answers. Expand any question below to add your answer.</p>
            </div>
          </div>
        </section>
      )}
      
      {/* Questions Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isAuthor ? 'Community Questions - Answer as Expert' : 'Community Questions'}
          </h2>
          
          {loading ? (
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
                const answers = questionAnswers[questionId] || []
                
                return (
                  <div key={questionId} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {isEditing ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                              rows="4"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(questionId)}
                              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                            >
                              Cancel
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
                          <p className="text-gray-700 mb-4">{q.content}</p>
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
                            <textarea
                              rows="3"
                              value={answerText[questionId] || ''}
                              onChange={(e) => setAnswerText({ ...answerText, [questionId]: e.target.value })}
                              placeholder="Share your expert knowledge..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                            />
                            <button
                              onClick={() => handleAddAnswer(questionId)}
                              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm"
                            >
                              Post Expert Answer
                            </button>
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
                          
                          {loadingAnswers[questionId] ? (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                          ) : answers.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No answers yet. Be the first to answer!</p>
                          ) : (
                            answers.map((answer) => {
                              const answerId = answer.answerId || answer.id
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
                                        <div className="mt-3 pl-4 border-l-2 border-primary-200">
                                          <textarea
                                            rows="2"
                                            value={replyText[answerId] || ''}
                                            onChange={(e) => setReplyText({ ...replyText, [answerId]: e.target.value })}
                                            placeholder="Write your reply..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm mb-2"
                                          />
                                          <button
                                            onClick={() => handleReplyToAnswer(questionId, answerId)}
                                            className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                                          >
                                            Post Reply
                                          </button>
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
          
          {!loading && questions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Popular Topics Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
          
          {viewMode === 'user' && user && (
            <div className="text-center mt-10">
              <button 
                onClick={() => setViewMode('all')}
                className="btn-secondary rounded-3xl hover:bg-green-600 hover:text-white"
              >
                View All Community Questions
              </button>
            </div>
          )}
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